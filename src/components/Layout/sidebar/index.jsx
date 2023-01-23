import { onSnapshot } from '@firebase/firestore';
import {
	IconCalendarEvent,
	IconFolder,
	IconLayoutDashboard,
	IconList,
	IconPlus,
} from '@tabler/icons';
import clsx from 'clsx';
import Button from 'components/ui/Button';
import CreateHabitBtn from 'components/ui/CreateHabitBtn';
import { useEffect, useState } from 'react';
import { createCategory } from 'services/dbOperations';
import { getUserDoc } from 'services/firestoreReferences';
import SidebarLink from './SidebarLink';

export default function Sidebar({ className = '', isMobile }) {
	const [categoryValue, setCategoryValue] = useState('');
	const [categories, setCategories] = useState([]);

	useEffect(() => {
		return onSnapshot(getUserDoc(), (doc) => {
			setCategories(doc.data().categories || []);
			setCategoryValue('');
		});
	}, []);

	const hanldeCreateCategory = (e) => {
		if (e.type === 'keydown' && e.key === 'Enter') {
			createCategory(categoryValue);
		}
	};

	return (
		<aside
			className={clsx(
				'w-0 overflow-x-hidden overflow-y-scroll p-0 pt-6 transition-all md:w-64 md:pl-6',
				className
			)}>
			<CreateHabitBtn />
			<nav className='my-8 w-3/4 flex-1'>
				<ul className='flex flex-col'>
					<li>
						<SidebarLink
							to='/dashboard'
							Icon={IconLayoutDashboard}
							text='dashboard'
						/>
					</li>
					<li>
						<SidebarLink
							to='/today'
							Icon={IconCalendarEvent}
							text='today'
						/>
					</li>
					<li>
						<SidebarLink
							to='/all-habits'
							Icon={IconList}
							text='All Habits'
						/>
					</li>
				</ul>
				{/* <h3 className='mt-4 text-xs font-semibold uppercase text-slate-600'>
					Categories
				</h3> */}
				{/* <ul className='flex flex-col'>
					{categories.map((category) => (
						<li key={category.id}>
							<SidebarLink
								to={`/${category.name}`}
								text={category.name}
								Icon={IconFolder}
							/>
						</li>
					))}
				</ul>
				<div className='flex items-center text-sm text-gray-400'>
					<IconPlus className='' />
					<input
						type='text'
						placeholder='New Category'
						value={categoryValue}
						onChange={(e) => setCategoryValue(e.target.value)}
						onKeyDown={hanldeCreateCategory}
						className='rounded-md bg-slate-200 p-2 text-slate-800 hover:bg-slate-300'
					/>
				</div> */}
			</nav>
		</aside>
	);
}
