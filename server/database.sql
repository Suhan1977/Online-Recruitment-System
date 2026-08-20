CREATE DATABASE recruitment_db;
USE recruitment_db;

-- login detials  
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


CREATE TABLE jobs (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    company VARCHAR(100) NOT NULL,
    location VARCHAR(100) NOT NULL
);

CREATE TABLE applications (
    id INT AUTO_INCREMENT PRIMARY KEY,
    job_id INT NOT NULL,
    applicant_name VARCHAR(100) NOT NULL,
    applicant_email VARCHAR(100) NOT NULL,
    age INT NOT NULL,
    is_18_plus BOOLEAN NOT NULL,
    nationality VARCHAR(100) NOT NULL,
    resume_path VARCHAR(255) NOT NULL,
    photo_path VARCHAR(255) NOT NULL,
    signature_path VARCHAR(255) NOT NULL,
    applied_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (job_id) REFERENCES jobs(id) ON DELETE CASCADE
);

INSERT INTO jobs (title, description, company, location) VALUES
('Frontend Developer', 'Looking for a React expert to build modern UIs.', 'TechCorp', 'Remote'),
('Backend Engineer', 'Node.js and Express backend engineer needed.', 'DataSystems', 'Pune'),
('Full Stack Developer', 'MERN/PERN stack developer for exciting projects.', 'StartupInc', 'Mumbai'),
('Networking Engineer', 'Basics of Networking and CISCO basics ', 'Networking', 'Nagpur');

INSERT INTO jobs (title, description, company, location) VALUES
('React Developer', 'Looking for a React expert to build modern UIs.', 'TCS', 'Delhi');

select * from applications;
select * from jobs;
select * from users;

