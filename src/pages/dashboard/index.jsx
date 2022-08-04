import { differenceInDays, format, parse } from 'date-fns';
import { useState } from 'react';
import HabitForm from '../../components/HabitForm';
import HabitsList from '../../components/HabitsList';
import CardLayout from '../../components/Layout/CardLayout';
import Modal from '../../components/Modal';
import { auth } from '../../firebase';

export default function Dashboard({ habits }) {
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [editingHabitId, setEditingHabitId] = useState(null);

	const isNewUser =
		auth.currentUser.metadata.creationTime ===
		auth.currentUser.metadata.lastSignInTime;

	const handleCloseModal = () => {
		setIsModalOpen(false);
		setEditingHabitId(null);
	};

	const handleOpenModal = (habitId = null) => {
		setIsModalOpen(true);
		setEditingHabitId(habitId);
	};

	const totalCompletions = habits.reduce(
		(prev, curr) => prev + curr.completions,
		0
	);

	const totalPossibleCompletions = habits.reduce((prev, curr) => {
		const startDate = parse(
			curr.trackingStartDate,
			'yyyy-MM-dd',
			new Date()
		);
		let diff = differenceInDays(new Date(), startDate);
		if (diff === 0) diff += 1;
		return prev + diff;
	}, 0);

	return (
		<>
			{isModalOpen && (
				<Modal onClose={handleCloseModal}>
					<HabitForm
						data={
							editingHabitId
								? habits.find(
										(habit) => habit.id === editingHabitId
								  )
								: null
						}
					/>
				</Modal>
			)}
			<header className='flex justify-between rounded-lg bg-indigo-200 p-4'>
				<div>
					<h1 className='text-2xl font-bold capitalize text-slate-800 md:text-3xl'>
						Welcome {!isNewUser ? 'back, ' : ''}
						{auth.currentUser.displayName}
						{console.log('display name', auth.currentUser)}
					</h1>
					<p className='mt-2 text-slate-600'>
						Here is an overview of your habits and progress
					</p>
				</div>
				<div>
					<div className='text-sm'>
						{format(new Date(), 'dd MMMM yyyy')}
					</div>
				</div>
			</header>
			<section className='my-8 flex flex-col gap-4 sm:flex-row'>
				<CardLayout className='' heading='Total Habits'>
					<div className='text-3xl font-bold text-slate-800'>
						{habits.length}
					</div>
				</CardLayout>
				<CardLayout className='' heading='Total Completions'>
					<div className='text-3xl font-bold text-slate-800'>
						{totalCompletions}
					</div>
				</CardLayout>
				<CardLayout className='' heading='Avg Completion Rate'>
					<div className='text-3xl font-bold text-slate-800'>
						{Math.round(
							(totalCompletions / totalPossibleCompletions) * 100
						)}{' '}
						%
					</div>
				</CardLayout>
			</section>
			<HabitsList
				habits={habits}
				onOpenModal={handleOpenModal}
				asTopHabits
			/>
			{/* {showNotification && (
				<Notification type='success' message='Habit success' />
			)} */}
		</>
	);
}
