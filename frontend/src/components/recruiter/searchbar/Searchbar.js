import React, { useState, useEffect } from 'react';
import Table from 'react-bootstrap/Table';
import Container from 'react-bootstrap/Container';
import InputGroup from 'react-bootstrap/InputGroup';
import Form from 'react-bootstrap/Form';
import Spinner from 'react-bootstrap/Spinner';
import Alert from 'react-bootstrap/Alert';
import { Briefcase, Search } from 'react-bootstrap-icons';
import 'bootstrap/dist/css/bootstrap.min.css';

function JobSearch() {
  const [searchTerm, setSearchTerm] = useState('');
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const APP_ID = 'a3518aee'; // Replace with your actual Adzuna API ID
        const APP_KEY = '6391052c1e6589932333925ccc12fa13'; // Replace with your actual Adzuna API key
        const country = 'us';
        
        const response = await fetch(
          `https://api.adzuna.com/v1/api/jobs/${country}/search/1?app_id=${APP_ID}&app_key=${APP_KEY}&results_per_page=20`
        );
        
        const data = await response.json();
        
        if (data.results && data.results.length > 0) {
          const processedJobs = data.results.map(job => ({
            id: job.id,
            title: job.title,
            company: job.company?.display_name || 'Not specified',
            location: job.location?.display_name || 'Remote',
            salary: job.salary_max ? 
              `$${job.salary_min?.toLocaleString() || 'N/A'} - $${job.salary_max.toLocaleString()}` : 
              'Not specified',
            contractType: job.contract_type || 'Full-time',
            posted: new Date(job.created).toLocaleDateString(),
            description: job.description,
            skills: extractSkillsFromDescription(job.description),
            url: job.redirect_url
          }));
          setJobs(processedJobs);
        } else {
          setError('No jobs found');
        }
      } catch (err) {
        setError('Failed to fetch jobs. Please try again later.');
        console.error('Error fetching jobs:', err);
      } finally {
        setLoading(false);
      }
    };

    const extractSkillsFromDescription = (description) => {
      if (!description) return [];
      const commonSkills = [
        'JavaScript', 'Python', 'Java', 'C++', 'SQL',
        'React', 'Node.js', 'Angular', 'Vue',
        'AWS', 'Azure', 'Docker', 'Kubernetes',
        'Machine Learning', 'Data Analysis', 'AI',
        'HTML', 'CSS', 'TypeScript', 'REST API'
      ];
      return commonSkills.filter(skill => 
        description.toLowerCase().includes(skill.toLowerCase())
      ).slice(0, 5);
    };

    fetchJobs();
  }, []);

  const filteredJobs = jobs.filter(job => {
    if (!searchTerm) return true;

    const term = searchTerm.toLowerCase();
    return (
      job.title.toLowerCase().includes(term) ||
      job.skills.some(skill => skill.toLowerCase().includes(term)) ||
      job.description.toLowerCase().includes(term)
    );
  });

  if (loading) {
    return (
      <Container className="d-flex justify-content-center align-items-center" style={{ minHeight: '80vh' }}>
        <Spinner animation="border" variant="primary" />
        <span className="ms-3">Loading jobs...</span>
      </Container>
    );
  }

  if (error) {
    return (
      <Container className="mt-5">
        <Alert variant="danger">
          <Alert.Heading>Error</Alert.Heading>
          <p>{error}</p>
        </Alert>
      </Container>
    );
  }

  return (
    <Container className="my-5">
      <h1 className="text-center mb-4 text-secondary">
        <Briefcase className="me-2" />
        Job Listings
      </h1>
      
      <Form className="mb-4">
        <InputGroup>
          <InputGroup.Text>
            <Search />
          </InputGroup.Text>
          <Form.Control
            type="search"
            placeholder="Search by skill, job title, or description..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </InputGroup>
        <Form.Text className="text-muted">
          {filteredJobs.length} jobs found
        </Form.Text>
      </Form>

      <Table striped bordered hover responsive>
        <thead className="table-dark">
          <tr>
            <th>Job Title</th>
            <th>Company</th>
            <th>Location</th>
            <th>Salary</th>
            <th>Skills</th>
            <th>Posted</th>
          </tr>
        </thead>
        <tbody>
          {filteredJobs.length > 0 ? (
            filteredJobs.map((job) => (
              <tr key={job.id}>
                <td>
                  <a href={job.url} target="_blank" rel="noopener noreferrer">
                    {job.title}
                  </a>
                </td>
                <td>{job.company}</td>
                <td>{job.location}</td>
                <td>{job.salary}</td>
                <td>
                  {job.skills.map((skill, i) => (
                    <span key={i} className="badge bg-primary me-1 mb-1">
                      {skill}
                    </span>
                  ))}
                </td>
                <td>{job.posted}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="6" className="text-center">
                No jobs found matching your search criteria
              </td>
            </tr>
          )}
        </tbody>
      </Table>
    </Container>
  );
}

export default JobSearch;
