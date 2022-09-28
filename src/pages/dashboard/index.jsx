import { differenceInDays, format, parse } from 'date-fns';
import Card from '../../components/ui/Card';
import { auth } from '../../services';

export default function Dashboard({ habits }) {
	const isNewUser =
		auth.currentUser?.metadata.creationTime ===
		auth.currentUser?.metadata.lastSignInTime;

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

	// habits
	// 	.map(habit => ({name: habit.habitCategory, value: 1}))
	// 	.reduce((accumulator, curr) => accumulator.name === curr.name)

	const data01 = [
		{
			name: 'Personal',
			value: 2,
		},
		{
			name: 'Health and Fitness',
			value: 1,
		},
		{
			name: 'Work',
			value: 1,
		},
	];
	return (
		<main className='p-4 md:p-6 lg:p-8'>
			<h1 className='main-heading'>Dashboard</h1>
			<header className='flex justify-between rounded-lg bg-indigo-200 p-6'>
				<div>
					<h1 className='text-2xl font-bold capitalize text-slate-800 md:text-3xl'>
						Welcome {!isNewUser ? 'back, ' : ''}
						{auth.currentUser?.displayName}
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
			<section className='my-8 flex max-w-2xl flex-col gap-4 sm:flex-row'>
				<Card
					className='flex-grow'
					heading='Total Habits'
					variant='stat'>
					<div className='text-3xl font-bold text-slate-800'>
						{habits.length}
					</div>
				</Card>
				<Card
					className='flex-grow'
					heading='Total Completions'
					variant='stat'>
					<div className='text-3xl font-bold text-slate-800'>
						{totalCompletions}
					</div>
				</Card>
				<Card
					className='flex-grow'
					heading='Avg Completion Rate'
					variant='stat'>
					<div className='text-3xl font-bold text-slate-800'>
						{Math.round(
							(totalCompletions / totalPossibleCompletions) * 100
						)}{' '}
						%
					</div>
				</Card>
			</section>

			{/* <section className='flex flex-col gap-4 sm:flex-row'>
				<Card
					className='flex-grow'
					heading='Habits by Category'
					variant='chart'>
					<ResponsiveContainer width={400} height={400}>
						<PieChart width={1000} height={600}>
							<Pie
								data={data01}
								dataKey='value'
								nameKey='name'
								outerRadius={50}
								fill='#8884d8'
								label={({ name }) => name}
							/>
						</PieChart>
					</ResponsiveContainer>
					<p>This chart is coming soon</p>
				</Card>
				<Card
					className='flex-grow'
					heading='Categories'
					variant='chart'>
					<IconChartPie size='100' color='rgb(165 180 252)' />
					<p>This chart is coming soon</p>
				</Card>
			</section> */}
		</main>
	);
}
