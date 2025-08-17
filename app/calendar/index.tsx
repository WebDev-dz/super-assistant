import React, { useRef, useCallback } from 'react';
import { Animated, Easing, StyleSheet, Text, TouchableOpacity } from 'react-native';
import { ExpandableCalendar, AgendaList, CalendarProvider, WeekCalendar, Calendar } from 'react-native-calendars';
import testIDs from './testIDs';
import { getMarkedDates } from './mocks/agendaItems';
import AgendaItem from './mocks/AgendaItem';
import { getTheme, themeColor, lightThemeColor } from './mocks/theme';
import type XDate from 'xdate';
import db from '@/db';
import { Todo } from '@/lib/types';
import { useColorScheme } from '@/lib/useColorScheme';
const leftArrowIcon = require('./img/previous.png');
const rightArrowIcon = require('./img/next.png');

interface Props {
	weekView?: boolean;
}
const CHEVRON = require('./img/next.png');


const CalendarScreen = (props: Props) => {
	const { weekView } = props;
	const [value, setValue] = React.useState(new Date().toISOString())
	const { colorScheme } = useColorScheme()
	// Fetch tasks from the database using useQuery
	const { data, isLoading } = db.useQuery({ tasks: {} })
	const isDark = colorScheme === "dark"
	// Convert tasks to agendaItems format
	// Group tasks by dueDate and reduce them into agendaItems
	const agendaItems = React.useMemo(() => {
		if (!data?.tasks) return [];

		const groupedTasks = data.tasks.reduce((acc, task) => {
			const dueDate = task.dueDate ? new Date(task.dueDate).toISOString().split('T')[0] : 'No Due Date';
			if (!acc[dueDate]) {
				acc[dueDate] = [];
			}
			acc[dueDate].push(task as Todo);
			return acc;
		}, {} as Record<string, Todo[]>);

		return Object.entries(groupedTasks).map(([date, tasks]) => ({
			title: date,
			data: tasks
		}));
	}, [data?.tasks]);





	const marked = useRef(getMarkedDates());
	marked.current = {
		'2025-08-17': { marked: true, dotColor: 'red' }
	};

	const theme = useRef(getTheme());
	const todayBtnTheme = useRef({
		todayButtonTextColor: themeColor
	});

	// const onDateChanged = useCallback((date, updateSource) => {
	//   console.log('ExpandableCalendarScreen onDateChanged: ', date, updateSource);
	// }, []);

	// const onMonthChange = useCallback(({dateString}) => {
	//   console.log('ExpandableCalendarScreen onMonthChange: ', dateString);
	// }, []);

	const renderItem = useCallback(({ item }: any) => {
		return <AgendaItem item={item} />;
	}, []);

	const calendarRef = useRef<{ toggleCalendarPosition: () => boolean }>(null);
	const rotation = useRef(new Animated.Value(0));

	const toggleCalendarExpansion = useCallback(() => {
		const isOpen = calendarRef.current?.toggleCalendarPosition();
		Animated.timing(rotation.current, {
			toValue: isOpen ? 1 : 0,
			duration: 200,
			useNativeDriver: true,
			easing: Easing.out(Easing.ease)
		}).start();
	}, []);

	const renderHeader = useCallback(
		(date?: XDate) => {
			const rotationInDegrees = rotation.current.interpolate({
				inputRange: [0, 1],
				outputRange: ['0deg', '-180deg']
			});
			return (
				<TouchableOpacity style={styles.header} onPress={toggleCalendarExpansion}>
					<Text style={styles.headerTitle}>{date?.toString('MMMM yyyy')}</Text>
					<Animated.Image source={CHEVRON} style={{ transform: [{ rotate: '90deg' }, { rotate: rotationInDegrees }] }} />
				</TouchableOpacity>
			);
		},
		[toggleCalendarExpansion]
	);

	const onCalendarToggled = useCallback(
		(isOpen: boolean) => {
			rotation.current.setValue(isOpen ? 1 : 0);
		},
		[rotation]
	);


	if (isLoading) {
		return (
			<Text>Loading tasks...</Text>
		);
	}


	return (
		<CalendarProvider
			date={new Date().toISOString().split("T")[0]} // Default to today if no items
			// onDateChanged={onDateChanged}
			// onMonthChange={onMonthChange}
			showTodayButton
			// disabledOpacity={0.6}
			theme={todayBtnTheme.current}
		// todayBottomMargin={16}
		// disableAutoDaySelection={[ExpandableCalendar.navigationTypes.MONTH_SCROLL, ExpandableCalendar.navigationTypes.MONTH_ARROWS]}
		>

			<Calendar
				testID={testIDs.expandableCalendar.CONTAINER}
				renderHeader={renderHeader}
				ref={calendarRef}
				onCalendarToggled={onCalendarToggled}
			
				style={{ height: 358, }}
				// @ts-ignore

				//   onDayPress={(day) => {
				//     onChange?.(day.dateString === value ? '' : day.dateString);
				//   }}
				markedDates={{
					[value ?? '']: {
						selected: true,
					},
				}}

				theme={{
					textSectionTitleColor: isDark ? '#9CA3AF' : '#6B7280',
					timeLabel: {
						color: isDark ? '#9CA3AF' : '#6B7280',
					}

				}}

				current={value}
				// horizontal={false}
				// hideArrows
				// disablePan
				// hideKnob
				// initialPosition={ExpandableCalendar.positions.OPEN}
				// calendarStyle={styles.calendar}
				// headerStyle={styles.header} // for horizontal only
				// disableWeekScroll
				// theme={getTheme()}
				// disableAllTouchEventsForDisabledDays
				// style = {{backgroundColor: "red"}}
				firstDay={1}
				// markedDates={marked.current}
				leftArrowImageSource={leftArrowIcon}
				rightArrowImageSource={rightArrowIcon}
			// animateScroll
			// closeOnDayPress={false}
			/>

			<WeekCalendar testID={testIDs.weekCalendar.CONTAINER} firstDay={1} markedDates={marked.current} />

			<AgendaList
				sections={agendaItems || []}
				renderItem={renderItem}
				// scrollToNextEvent
				sectionStyle={styles.section}
				dayFormat={'yyyy-MM-d'}
			/>
		</CalendarProvider>
	);
};

export default CalendarScreen;

const styles = StyleSheet.create({
	calendar: {
		paddingLeft: 20,
		paddingRight: 20
	},
	header: {
		flexDirection: 'row',
		justifyContent: 'center',
		alignItems: 'center',
		marginVertical: 10
	},
	headerTitle: { fontSize: 16, fontWeight: 'bold', marginRight: 6 },
	section: {
		backgroundColor: lightThemeColor,
		color: 'grey',
		textTransform: 'capitalize'
	}
});