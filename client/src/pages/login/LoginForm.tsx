import {
    Alert,
    AlertIcon,
    Button,
    Card,
    CardBody,
    Checkbox,
    FormControl,
    FormLabel,
    Input,
} from '@chakra-ui/react'
import { useState } from 'react'
import { IconLogin } from '@tabler/icons-react'
import { useAuthContext } from 'context/AuthContext'
import authAPI from 'src/api/authAPI'
import useAPICallback from 'hooks/useAPICallback'

const testCredentials = {
    email: 'test@email.com',
    password: 'qwerasdf',
}

export default function LoginForm() {
    const [formData, setFormData] = useState(testCredentials)
    const { loginUser } = useAuthContext()
    const {
        error,
        isLoading,
        callback: handleLogin,
    } = useAPICallback(() => authAPI.login(formData))

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        handleLogin(loginUser)
    }

    return (
        <Card
            as="form"
            display="flex"
            flexDirection="column"
            gap="6"
            onSubmit={handleSubmit}
        >
            <CardBody display="flex" flexDirection="column" gap="4">
                <FormControl>
                    <FormLabel>Email</FormLabel>
                    <Input
                        type="email"
                        value={formData.email}
                        onChange={(e) =>
                            setFormData({ ...formData, email: e.target.value })
                        }
                        placeholder="name@domain.com"
                    />
                </FormControl>
                <FormControl>
                    <FormLabel>Password</FormLabel>
                    <Input
                        value={formData.password}
                        onChange={(e) =>
                            setFormData({
                                ...formData,
                                password: e.target.value,
                            })
                        }
                        type="password"
                        placeholder="atleast 8 characters"
                    />
                </FormControl>
                {error && (
                    <Alert status="error">
                        <AlertIcon />
                        {error}
                    </Alert>
                )}
                <Checkbox
                    isChecked={
                        formData.email === testCredentials.email &&
                        formData.password === testCredentials.password
                    }
                    onChange={(e) =>
                        setFormData(
                            e.target.checked
                                ? testCredentials
                                : { email: '', password: '' }
                        )
                    }
                >
                    Use test login credentials
                </Checkbox>
                <Button
                    isLoading={isLoading}
                    colorScheme="green"
                    type="submit"
                    disabled={isLoading}
                    rightIcon={<IconLogin />}
                >
                    Login
                </Button>
            </CardBody>
        </Card>
    )
}
