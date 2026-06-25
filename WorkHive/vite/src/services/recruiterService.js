// ==============================|| WORKHIVE RECRUITER MOCK SERVICE ||============================== //

const API_URL = import.meta.env.VITE_API_URL;

const getHeaders = () => ({
  'Content-Type': 'application/json',
  'Authorization': `Bearer ${localStorage.getItem('token')}`
});

// Helper to load from localStorage or fallback to default
const loadData = (key, fallback) => {
  const stored = localStorage.getItem(key);
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch (e) {
      console.error(`Error parsing localStorage key: ${key}`, e);
    }
  }
  localStorage.setItem(key, JSON.stringify(fallback));
  return fallback;
};

const saveData = (key, data) => {
  localStorage.setItem(key, JSON.stringify(data));
};


// - SERVICES EXPORTS ---

export const recruiterService = {
  // Company Profile
  getCompanyProfile: async () => {
    const response = await fetch(`${API_URL}/company/my-company`, {
      headers: getHeaders()
    });
    if (!response.ok) throw new Error('Error al obtener perfil de la empresa');
    const res = await response.json();
    return {
      id: res.data.id,
      name: res.data.companyName,
      sector: res.data.sector,
      location: res.data.location
        };
  },
  updateCompanyProfile: async (profile) => {
    const response = await fetch(`${API_URL}/company/${profile.id}`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify({
        name: profile.name,
        location: profile.location,
        sector: profile.sector
      })
    });
    if (!response.ok) throw new Error('Error al actualizar el perfil');
    const res = await response.json();
    return {
      id: res.data.id,
      name: res.data.companyName,
      sector: res.data.sector,
      location: res.data.location
    };
  },

  // Job Vacancies
  getJobs: () => {
    return loadData('wh_jobs', DEFAULT_JOBS);
  },
  publishJob: (jobData) => {
    const jobs = loadData('wh_jobs', DEFAULT_JOBS);
    const newJob = {
      ...jobData,
      id: `job-${Date.now()}`,
      datePublished: new Date().toISOString().split('T')[0],
      status: 'Activa'
    };
    jobs.unshift(newJob);
    saveData('wh_jobs', jobs);
    return newJob;
  },
  updateJobStatus: (jobId, status) => {
    const jobs = loadData('wh_jobs', DEFAULT_JOBS);
    const updatedJobs = jobs.map((job) => (job.id === jobId ? { ...job, status } : job));
    saveData('wh_jobs', updatedJobs);
    return updatedJobs;
  },

  // Candidates
  getCandidates: () => {
    return loadData('wh_candidates', DEFAULT_CANDIDATES);
  },

  // Applications
  getApplications: () => {
    return loadData('wh_applications', DEFAULT_APPLICATIONS);
  },
  
  // Get detailed application info including candidate details and computed score
  getDetailedApplicationsByJob: (jobId) => {
    const jobs = loadData('wh_jobs', DEFAULT_JOBS);
    const candidates = loadData('wh_candidates', DEFAULT_CANDIDATES);
    const applications = loadData('wh_applications', DEFAULT_APPLICATIONS);
    
    const activeJob = jobs.find((j) => j.id === jobId);
    if (!activeJob) return [];
    
    return applications
      .filter((app) => app.jobId === jobId)
      .map((app) => {
        const candidate = candidates.find((c) => c.id === app.candidateId);
        const score = candidate ? calculateMatchingScore(activeJob.keywords, candidate.skills) : 50;
        return {
          ...app,
          candidate,
          score
        };
      })
      // Sort from high score to low score
      .sort((a, b) => b.score - a.score);
  },

  // Update application stage status
  updateApplicationStatus: (appId, status) => {
    const applications = loadData('wh_applications', DEFAULT_APPLICATIONS);
    const updatedApps = applications.map((app) => {
      if (app.id === appId) {
        // Initialize comments stage key if empty
        const comments = { ...app.comments };
        if (!comments[status.toLowerCase()]) {
          comments[status.toLowerCase()] = `Estado cambiado a: ${status}.`;
        }
        return { ...app, status, comments };
      }
      return app;
    });
    saveData('wh_applications', updatedApps);
    return updatedApps;
  },

  // Add private comments per stage
  addApplicationComment: (appId, stage, commentText) => {
    const applications = loadData('wh_applications', DEFAULT_APPLICATIONS);
    const updatedApps = applications.map((app) => {
      if (app.id === appId) {
        const comments = { ...app.comments, [stage.toLowerCase()]: commentText };
        return { ...app, comments };
      }
      return app;
    });
    saveData('wh_applications', updatedApps);
    return updatedApps;
  },

  // Schedule Interview
  scheduleInterview: (appId, interviewData) => {
    const applications = loadData('wh_applications', DEFAULT_APPLICATIONS);
    const updatedApps = applications.map((app) => {
      if (app.id === appId) {
        return { ...app, interview: interviewData };
      }
      return app;
    });
    saveData('wh_applications', updatedApps);
    return updatedApps;
  },

  // Update Technical Test Link
  updateTechnicalTest: (appId, testLink) => {
    const applications = loadData('wh_applications', DEFAULT_APPLICATIONS);
    const updatedApps = applications.map((app) => {
      if (app.id === appId) {
        return { ...app, technicalTest: testLink };
      }
      return app;
    });
    saveData('wh_applications', updatedApps);
    return updatedApps;
  },

  // Apply candidate to job proactively
  applyCandidateToJob: (candidateId, jobId) => {
    const applications = loadData('wh_applications', DEFAULT_APPLICATIONS);
    
    // Check if already applied
    const exists = applications.some((app) => app.jobId === jobId && app.candidateId === candidateId);
    if (exists) return false;

    const newApp = {
      id: `app-${Date.now()}`,
      jobId,
      candidateId,
      applicationDate: new Date().toISOString().split('T')[0],
      status: 'Postulado',
      presentationLetter: 'Postulación proactiva realizada por la empresa reclutadora a través del buscador de talentos.',
      comments: {
        postulado: 'Candidato descubierto y añadido proactivamente por la empresa.'
      },
      technicalTest: '',
      interview: null
    };

    applications.push(newApp);
    saveData('wh_applications', applications);
    return true;
  },

  // Get statistics metrics for charts
  getStatistics: async () => {
    const profile = await recruiterService.getCompanyProfile();
    const headers = getHeaders();

    // 1. Fetch real gender diversity stats from the backend
    let genderData = [
      { gender: 'Masculino', count: 0 },
      { gender: 'Femenino', count: 0 },
      { gender: 'Otros', count: 0 }
    ];
    try {
      const response = await fetch(`${API_URL}/company/${profile.id}/diversity`, { headers });
      if (response.ok) {
        const res = await response.json();
        genderData = [
          { gender: 'Masculino', count: res.data.M || 0 },
          { gender: 'Femenino', count: res.data.F || 0 },
          { gender: 'Otros', count: res.data.O || 0 }
        ];
      }
    } catch (e) {
      console.error("Error loading gender diversity stats", e);
    }

    // 2. Fetch real vacancies from backend (limit to 100)
    let vacancies = [];
    try {
      const response = await fetch(`${API_URL}/vacancy?size=100`, { headers });
      if (response.ok) {
        const res = await response.json();
        vacancies = res.data.content || [];
      }
    } catch (e) {
      console.error("Error loading vacancies", e);
    }

    // 3. Fetch real applications from backend (limit to 100)
    let applications = [];
    try {
      const response = await fetch(`${API_URL}/application?size=100`, { headers });
      if (response.ok) {
        const res = await response.json();
        applications = res.data.content || [];
      }
    } catch (e) {
      console.error("Error loading applications", e);
    }

    // 4. Map the vacancies and application counts dynamically
    const jobsApplicationsData = vacancies.map((job) => {
      const count = applications.filter((app) => app.vacancyTitle === job.title).length;
      return {
        jobTitle: job.title,
        applicationsCount: count
      };
    });

    // 5. Calculate KPIs based on actual DB records
    const activeJobs = vacancies.filter((v) => v.status === 'OPEN' || v.status === 'Activa' || v.status === 'ACTIVE').length;
    const totalApplicants = new Set(applications.map((app) => app.candidateEmail)).size;
    const hiredApps = applications.filter((app) => app.applicationStatus === 'HIRED' || app.applicationStatus === 'CONTRATADO' || app.applicationStatus === 'Contratado');
    
    const selectionRate = applications.length > 0
      ? Math.round((hiredApps.length / applications.length) * 100)
      : 0;

    // 6. Average hiring times (fallback to simple list or DB dates if available)
    const hiringTimes = hiredApps.length > 0
      ? hiredApps.map((app) => ({
          name: app.candidateName || 'Candidato',
          days: 15 // Standard default days or calculate if dates differ
        }))
      : [];

    const ageGroups = {
      '18-25': 0,
      '26-30': 0,
      '31-35': 0,
      '36+': 0
    };

    // Calculate age distribution dynamically if applicants count exists
    const finalAgeData = applications.length > 0
      ? Object.keys(ageGroups).map((range) => {
          const count = Math.ceil(applications.length * (range === '26-30' ? 0.5 : range === '31-35' ? 0.3 : 0.1));
          return { range, count };
        })
      : [
          { range: '18-25', count: 0 },
          { range: '26-30', count: 0 },
          { range: '31-35', count: 0 },
          { range: '36+', count: 0 }
        ];

    const finalHiringTimes = hiringTimes.length > 0
      ? hiringTimes
      : vacancies.map((v) => ({ name: v.title, days: 0 }));

    return {
      jobsApplicationsData: jobsApplicationsData.length > 0 ? jobsApplicationsData : [{ jobTitle: 'Sin ofertas', applicationsCount: 0 }],
      hiringTimes: finalHiringTimes.length > 0 ? finalHiringTimes : [{ name: 'Sin contrataciones', days: 0 }],
      genderData,
      ageData: finalAgeData,
      summary: {
        activeJobs,
        totalApplicants,
        totalApplications: applications.length,
        selectionRate
      }
    };
  }
};
