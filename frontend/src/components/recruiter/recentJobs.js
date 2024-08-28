import React from 'react';

const RecentJobApplicationsTable = () => {
  const recentJobApplications = [
    {
      _id: 1,
      jobTitle: 'Software Developer',
      applications: 20,
      applicationDate: '10-01-24',
      status: 'Open'
    },
    {
      _id: 2,
      jobTitle: 'UI/UX Designer',
      applications: 45,
      applicationDate: '12-01-24',
      status: 'Closed'
    },
    // Add more dummy data as needed
  ];

  return (
    <div className="flex justify-center items-center w-full max-w-screen-lg">
      <div className="w-full max-w-screen-lg overflow-x-auto mt-8">
        <table className="table-auto">
          <thead>
            <tr>
              <th className="px-4 py-2">Job Title</th>
              <th className="px-4 py-2">Applications</th>
              <th className="px-4 py-2">Application Date</th>
              <th className="px-4 py-2">Status</th>
            </tr>
          </thead>
          <tbody>
            {recentJobApplications.slice(0, 5).map((application) => (
              <tr key={application._id}>
                <td className="border px-4 py-2 w-3/5">{application.jobTitle}</td>
                <td className="border px-4 py-2 w-3/5">{application.applications}</td>
                <td className="border px-4 py-2 w-3/5">{application.applicationDate}</td>
                <td className="border px-4 py-2 w-3/5">{application.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default RecentJobApplicationsTable;