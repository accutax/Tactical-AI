document.addEventListener("DOMContentLoaded", async () => {
  const matchSelect = document.getElementById("match-select");
  const analyzeButton = document.getElementById("analyze-button");
  const downloadSection = document.getElementById("download-section");
  const downloadLink = document.getElementById("download-link");

  try {
    // Fetch live matches from your Heroku backend
    const response = await fetch("https://tacticalai.herokuapp.com/get-live-matches");
    const matches = await response.json();

    if (matches.length === 0) {
      matchSelect.innerHTML = '<option value="" disabled selected>No matches available</option>';
      return;
    }

    // Populate dropdown with matches
    matches.forEach((match) => {
      const option = document.createElement("option");
      option.value = match.id; // Use match ID as value
      option.textContent = `${match.homeTeam} vs ${match.awayTeam} (${match.status})`;
      matchSelect.appendChild(option);
    });

    // Handle button click
    analyzeButton.addEventListener("click", async () => {
      const selectedMatchId = matchSelect.value;
      if (!selectedMatchId) {
        alert("Please select a match.");
        return;
      }

      // Send selected match ID to your Heroku backend
      const response = await fetch("https://tacticalai.herokuapp.com/generate-pre-match-video", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ matchId: selectedMatchId }),
      });

      if (response.ok) {
        const data = await response.json();
        const videoUrl = data.videoUrl;

        // Show download link
        downloadLink.href = videoUrl;
        downloadSection.style.display = "block";
      } else {
        alert("Failed to generate video. Please try again.");
      }
    });
  } catch (error) {
    console.error("Error:", error);
    alert("An error occurred while fetching match data.");
  }
});