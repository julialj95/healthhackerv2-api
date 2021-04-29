function makeLogsArray() {
  return [
    {
      id: 1,
      user_id: 1,
      log_date: "2021-04-28",
      mood: 5,
      stress: 3,
      sleep_hours: 7.5,
      sleep_quality: 5,
      exercise_type: "Biking",
      exercise_minutes: 45,
      water: 60,
      notes: "Notes Test",
    },
    {
      id: 2,
      user_id: 1,
      log_date: "2021-04-27",
      mood: 4,
      stress: 3,
      sleep_hours: 7.5,
      sleep_quality: 5,
      exercise_type: "Walking",
      exercise_minutes: 45,
      water: 60,
      notes: "Notes Test 2",
    },
    {
      id: 3,
      user_id: 2,
      log_date: "2021-04-26",
      mood: 5,
      stress: 5,
      sleep_hours: 7.5,
      sleep_quality: 5,
      exercise_type: "Jumproping",
      exercise_minutes: 45,
      water: 60,
      notes: "Notes Test 3",
    },
  ];
}

module.exports = { makeLogsArray };
