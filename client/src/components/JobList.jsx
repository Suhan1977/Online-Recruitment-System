import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

function JobList({ user }) {
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [appliedJobIds, setAppliedJobIds] = useState([]);

    useEffect(() => {
        // Load applied jobs specifically for the logged-in user's email
        if (user) {
            const userStorageKey = `appliedJobs_${user.email}`;
            const savedApplied = JSON.parse(localStorage.getItem(userStorageKey) || '[]');
            setAppliedJobIds(savedApplied);
        }

        const fetchJobs = async () => {
            try {
                const response = await axios.get('http://localhost:5000/api/jobs');
                setJobs(response.data);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching jobs:', error);
                setLoading(false);
            }
        };
        fetchJobs();
    }, [user]);

    if (loading) return <div>Loading available jobs...</div>;

    return (
        <div>
            <h2>Open Positions</h2>
            {jobs.length === 0 ? <p>No jobs available right now.</p> : null}
            
            {jobs.map(job => {
                const isApplied = appliedJobIds.includes(String(job.id));

                return (
                    <div key={job.id} className="job-card">
                        <h3 style={{ margin: '0 0 10px 0' }}>{job.title}</h3>
                        <p style={{ color: '#555' }}>
                            <strong>Company:</strong> {job.company} &nbsp;|&nbsp; 
                            <strong>Location:</strong> {job.location}
                        </p>
                        <p>{job.description}</p>

                        {isApplied ? (
                            <button className="btn btn-applied" disabled style={{ backgroundColor: '#6c757d', cursor: 'not-allowed' }}>
                                ✓ Applied
                            </button>
                        ) : (
                            <Link to={`/apply/${job.id}`} className="btn">
                                Apply Now
                            </Link>
                        )}
                    </div>
                );
            })}
        </div>
    );
}

export default JobList;