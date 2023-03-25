import {
	onSnapshot,
	query,
	getDocs,
	addDoc,
	where,
	doc,
	Timestamp,
	limit,
} from '@firebase/firestore';
import { useEffect, useState } from 'react';
import {
	getDateDoc,
	datesCollection,
	habitsCollection,
} from 'services/firestoreReferences';
import { toStringPercent } from 'utils/misc';
import {
	Heading,
	Container,
	Text,
	Card,
	CardBody,
	Box,
	IconButton,
	HStack,
	Skeleton,
} from '@chakra-ui/react';
import { HabitTodos } from './HabitTodos';
import { ChevronLeftIcon, ChevronRightIcon } from '@chakra-ui/icons';
import {
	addDays,
	endOfDay,
	isToday,
	isYesterday,
	startOfDay,
	subDays,
} from 'date-fns';
import { useRef } from 'react';
import {
	createDateDoc,
	DateDoc,
	markHabitComplete,
} from 'services/dbOperations';
import * as React from 'react';

export type HabitTodo = {
	id: string;
	isComplete: boolean;
	name: string;
};

export default function Today() {
	const [date, setDate] = useState(new Date());
	const [habitTodos, setHabitTodos] = useState<HabitTodo[]>([]);
	const documentId = useRef<string>(null);

	const completedHabits = habitTodos.filter((habit) => habit.isComplete);
	const incompleteHabits = habitTodos.filter((habit) => !habit.isComplete);

	const isDateToday = isToday(date);
	const isDateYesterday = isYesterday(date);

	const handleCheckHabit =
		(habitId: string) => (e: React.ChangeEvent<HTMLInputElement>) =>
			markHabitComplete(e.target.checked, habitId, documentId.current);

	useEffect(() => {
		return onSnapshot(
			query(
				datesCollection(),
				where('date', '>=', startOfDay(date)),
				where('date', '<=', endOfDay(date)),
				limit(1)
			),
			async ({ empty, docs }) => {
				if (empty) {
					createDateDoc(date);
				} else {
					documentId.current = docs[0].id;
					const habits: DateDoc['habits'] = docs[0].get('habits');
					setHabitTodos(
						Object.entries(habits).map<HabitTodo>(
							([id, habit]) => ({
								id,
								isComplete: habit.isComplete,
								name: habit.name,
							})
						)
					);
				}
			}
		);
	}, [date]);

	return (
		<Container display='flex' flexDirection='column' gap='4'>
			<Box>
				<HStack>
					<Heading size='md'>
						{isDateToday
							? 'Today'
							: isDateYesterday
							? 'Yesterday'
							: date.toDateString()}
					</Heading>
					<IconButton
						bg='white'
						variant='outline'
						aria-label='previous'
						icon={<ChevronLeftIcon />}
						onClick={() => setDate(subDays(date, 1))}
					/>
					<IconButton
						bg='white'
						variant='outline'
						isDisabled={isDateToday}
						aria-label='next'
						icon={<ChevronRightIcon />}
						onClick={() => setDate(addDays(date, 1))}
					/>
				</HStack>
				<Text as='span' color='gray.400' size='sm'>
					{(isDateToday || isDateYesterday) && date.toDateString()}
				</Text>
			</Box>
			<Text as='span' className='text-sm italic'>
				{completedHabits.length} / {habitTodos.length} habits complete
			</Text>
			<HabitTodos
				todos={incompleteHabits}
				heading='To do'
				onCheckHabit={handleCheckHabit}
			/>
			<HabitTodos
				todos={completedHabits}
				heading='Completed'
				onCheckHabit={handleCheckHabit}
			/>
		</Container>
	);
}
