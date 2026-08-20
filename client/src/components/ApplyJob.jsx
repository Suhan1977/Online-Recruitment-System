import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';

function ApplyJob({ user }) {
    const { jobId } = useParams();
    const navigate = useNavigate();
    const [job, setJob] = useState(null);
    
    // Auto-fill the name and email from the logged-in user
    const [formData, setFormData] = useState({
        applicant_name: user?.name || '',
        applicant_email: user?.email || '',
        age: '',
        nationality: '',
        is_18_plus: false,
        resume: null,
        photo: null,
        signature: null
    });
    
    const [message, setMessage] = useState('');
    const [isError, setIsError] = useState(false);

    useEffect(() => {
        const fetchJobDetails = async () => {
            try {
                const response = await axios.get(`http://localhost:5000/api/jobs/${jobId}`);
                setJob(response.data);
            } catch (error) {
                console.error('Error fetching job details:', error);
                setMessage('Job not found.');
                setIsError(true);
            }
        };
        fetchJobDetails();
    }, [jobId]);

    const handleTextChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData({ 
            ...formData, 
            [name]: type === 'checkbox' ? checked : value 
        });
    };

    const handleFileChange = (e) => {
        setFormData({ 
            ...formData, 
            [e.target.name]: e.target.files[0] 
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage('');
        setIsError(false);

        const submitData = new FormData();
        submitData.append('job_id', jobId);
        submitData.append('applicant_name', formData.applicant_name);
        submitData.append('applicant_email', formData.applicant_email);
        submitData.append('age', formData.age);
        submitData.append('nationality', formData.nationality);
        submitData.append('is_18_plus', formData.is_18_plus);
        submitData.append('resume', formData.resume);
        submitData.append('photo', formData.photo);
        submitData.append('signature', formData.signature);

        try {
            const response = await axios.post('http://localhost:5000/api/applications', submitData);
            
            // Save applied jobId to the specific user's localStorage profile
            const userStorageKey = `appliedJobs_${user.email}`;
            const appliedJobs = JSON.parse(localStorage.getItem(userStorageKey) || '[]');
            
            if (!appliedJobs.includes(String(jobId))) {
                appliedJobs.push(String(jobId));
                localStorage.setItem(userStorageKey, JSON.stringify(appliedJobs));
            }

            setMessage(response.data.message);
            
            setTimeout(() => {
                navigate('/');
            }, 1500);
        } catch (error) {
            console.error('Error submitting application:', error);
            setMessage(error.response?.data?.message || 'Failed to submit application.');
            setIsError(true);
        }
    };

    if (!job && !message) return <div>Loading...</div>;

    return (
        <div>
            <Link to="/" className="btn" style={{ backgroundColor: '#6c757d', marginBottom: '20px' }}>&larr; Back to Jobs</Link>
            
            {job && (
                <>
                    <h2>Apply for {job.title}</h2>
                    <p><strong>Company:</strong> {job.company}</p>
                </>
            )}
            
            {message && (
                <div className={`message ${isError ? 'error' : ''}`}>
                    {message}
                </div>
            )}

            {job && (
                <form onSubmit={handleSubmit} className="job-card">
                    <div className="form-group">
                        <label>Full Name</label>
                        <input type="text" name="applicant_name" value={formData.applicant_name} onChange={handleTextChange} required />
                    </div>
                    
                    <div className="form-group">
                        <label>Email Address</label>
                        <input type="email" name="applicant_email" value={formData.applicant_email} onChange={handleTextChange} required readOnly style={{ backgroundColor: '#e9ecef', color: '#495057' }} />
                        <small style={{ color: '#6c757d' }}>Email is locked to your account.</small>
                    </div>

                    <div className="form-group" style={{ display: 'flex', gap: '20px' }}>
                        <div style={{ flex: 1 }}>
                            <label>Age</label>
                            <input type="number" name="age" onChange={handleTextChange} min="16" max="99" required />
                        </div>
                        <div style={{ flex: 1 }}>
                            <label>Nationality</label>
                            <input type="text" name="nationality" onChange={handleTextChange} placeholder="e.g., Indian" required />
                        </div>
                    </div>

                    <div className="form-group" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <input type="checkbox" name="is_18_plus" id="is_18_plus" onChange={handleTextChange} style={{ width: 'auto' }} required />
                        <label htmlFor="is_18_plus" style={{ margin: 0 }}>I confirm that I am 18 years of age or older.</label>
                    </div>

                    <hr style={{ margin: '20px 0', border: '0', borderTop: '1px solid #ccc' }} />

                    <div className="form-group">
                        <label>Upload Resume (PDF/DOCX)</label>
                        <input type="file" name="resume" accept=".pdf,.doc,.docx" onChange={handleFileChange} required style={{ border: 'none', padding: 0 }} />
                    </div>

                    <div className="form-group">
                        <label>Upload Passport Photo (JPG/PNG)</label>
                        <input type="file" name="photo" accept="image/png, image/jpeg" onChange={handleFileChange} required style={{ border: 'none', padding: 0 }} />
                    </div>

                    <div className="form-group">
                        <label>Upload Signature (JPG/PNG)</label>
                        <input type="file" name="signature" accept="image/png, image/jpeg" onChange={handleFileChange} required style={{ border: 'none', padding: 0 }} />
                    </div>

                    <button type="submit" className="btn" style={{ width: '100%', marginTop: '10px' }}>Submit Complete Application</button>
                </form>
            )}
        </div>
    );
}

export default ApplyJob;