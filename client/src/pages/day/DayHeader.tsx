import {
   CalendarIcon,
   ChevronLeftIcon,
   ChevronRightIcon,
} from '@chakra-ui/icons';
import {
   Button,
   ButtonGroup,
   Card,
   CardBody,
   Flex,
   Heading,
   IconButton,
   Popover,
   PopoverArrow,
   PopoverBody,
   PopoverCloseButton,
   PopoverContent,
   PopoverTrigger,
   Text,
   useDisclosure,
} from '@chakra-ui/react';
import dayjs, { Dayjs } from 'dayjs';
import calendar from 'dayjs/plugin/calendar';
import Calendar from './Calendar';

dayjs.extend(calendar);

type DayHeaderProps = { date: Dayjs; onDateChange: (date: Dayjs) => void };

export default function DayHeader({ date, onDateChange }: DayHeaderProps) {
   const { isOpen, onToggle, onClose } = useDisclosure();

   const isDateToday = date.isSame(dayjs(), 'date');
   const handleLeftArrowClick = () => onDateChange(date.subtract(1, 'day'));
   const handleRightArrowClick = () => onDateChange(date.add(1, 'day'));

   return (
      <Card>
         <CardBody>
            <Flex justifyContent="space-between" gap="4">
               <Heading
                  textTransform="capitalize"
                  color="gray.800"
                  fontWeight="bold"
                  size="lg"
               >
                  {date.calendar(null, {
                     sameDay: '[Today]',
                     nextDay: '[Tomorrow]',
                     nextWeek: '[Next] dddd',
                     lastDay: '[Yesterday]',
                     lastWeek: '[Last] dddd',
                  })}
               </Heading>
               <ButtonGroup variant="outline" isAttached>
                  <Popover isOpen={isOpen} onClose={onClose}>
                     <PopoverTrigger>
                        <Button leftIcon={<CalendarIcon />} onClick={onToggle}>
                           Calendar
                        </Button>
                     </PopoverTrigger>
                     <PopoverContent>
                        <PopoverArrow />
                        <PopoverCloseButton />
                        <PopoverBody>
                           <Calendar
                              date={date.toDate()}
                              selected={date.toDate()}
                              onDateSelected={(date) => {
                                 onDateChange(dayjs(date.date));
                                 onClose();
                              }}
                           />
                        </PopoverBody>
                     </PopoverContent>
                  </Popover>
                  <IconButton
                     aria-label="previous day"
                     icon={<ChevronLeftIcon boxSize="7" />}
                     onClick={handleLeftArrowClick}
                  />

                  <IconButton
                     aria-label="next day"
                     icon={<ChevronRightIcon boxSize="7" />}
                     onClick={handleRightArrowClick}
                  />
               </ButtonGroup>
            </Flex>
            <Flex
               gap="4"
               justifyContent="space-between"
               alignItems="center"
               mt="2"
            >
               <Text fontStyle="italic" color="gray.600">
                  {date.format('dddd, MMMM DD YYYY')}
               </Text>
               {!isDateToday && (
                  <Button
                     onClick={() => onDateChange(dayjs())}
                     variant="outline"
                  >
                     Jump to today
                  </Button>
               )}
            </Flex>
         </CardBody>
      </Card>
   );
}