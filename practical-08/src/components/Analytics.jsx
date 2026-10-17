import React from 'react';

export default function Analytics() {
  const data = [
    { month: 'Jan', tasks: 12, completed: 10 },
    { month: 'Feb', tasks: 18, completed: 15 },
    { month: 'Mar', tasks: 25, completed: 22 },
    { month: 'Apr', tasks: 20, completed: 19 },
    { month: 'May', tasks: 32, completed: 28 },
    { month: 'Jun', tasks: 28, completed: 26 }
  ];

  return (
    <div className="page-box">
      <h2>Performance & Analytics Report</h2>
      <p>This is a heavy analytics view loaded dynamically via React.lazy() only when requested.</p>

      <table className="simple-table" style={{ marginTop: '16px' }}>
        <thead>
          <tr>
            <th>Month</th>
            <th>Tasks Created</th>
            <th>Tasks Completed</th>
            <th>Completion Rate</th>
          </tr>
        </thead>
        <tbody>
          {data.map((row) => (
            <tr key={row.month}>
              <td>{row.month}</td>
              <td>{row.tasks}</td>
              <td>{row.completed}</td>
              <td>{Math.round((row.completed / row.tasks) * 100)}%</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
