async function recommendJobs(predictedProfession, location = 'us') {
    const APP_ID = 'a3518aee';
    const APP_KEY = '6391052c1e6589932333925ccc12fa13';
    const country = location.toLowerCase();
    
    try {
      const response = await fetch(
        `https://api.adzuna.com/v1/api/jobs/${country}/search/1?app_id=${APP_ID}&app_key=${APP_KEY}&what=${encodeURIComponent(predictedProfession)}&results_per_page=10`
      );
      
      const data = await response.json();
      
      if (data.results && data.results.length > 0) {
        return data.results.map(job => ({
          title: job.title,
          company: job.company.display_name,
          location: job.location.display_name,
          description: job.description,
          url: job.redirect_url,
          posted: job.created
        }));
      } else {
        return []; // No jobs found
      }
    } catch (error) {
      console.error('Error fetching jobs:', error);
      return []; // Return empty array on error
    }
  }
  
  // Example usage
  const predictedJob = "software engineer";
  recommendJobs(predictedJob).then(jobs => {
    console.log("Recommended jobs:", jobs);
    // Display these jobs on your website
  });