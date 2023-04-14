import { endOfDay } from 'date-fns';
import { addDoc, getDocs, query, where } from 'firebase/firestore';
import { datesColRef, habitsColRef } from 'lib/db';
import { DateDoc } from 'types/firestoreDocTypes';
import { getDayOfWeek } from 'utils/dates';

export default async function createDateDoc(date: Date) {
   const querySnapshot = await getDocs(
      query(
         habitsColRef(),
         where('trackingStartDate', '<', endOfDay(date)),
         where(`repeatDays.${getDayOfWeek(date).toLowerCase()}`, '==', true)
      )
   );

   console.log(querySnapshot);

   const habits: DateDoc['habits'] = {};

   querySnapshot.forEach((doc) => {
      habits[doc.id] = {
         name: doc.get('name'),
         isComplete: false,
      };
   });

   return addDoc(datesColRef(), { date, habits });
}