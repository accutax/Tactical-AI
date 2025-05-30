// Function to fetch live matches from the backend
async function fetchLiveMatches() {
    const dropdown = document.getElementById("match-dropdown");
    const loadingMessage = document.getElementById("loading-message");

    try {
        // Show a loading message while fetching data
        dropdown.innerHTML = ""; // Clear previous options
        loadingMessage.textContent = "Loading matches...";

        // Fetch live matches from the backend
        const response = await fetch("https://tacticalai-b1b6e9ee43ed.herokuapp.com/get-live-matches");
        
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const matches = await response.json();

        // Clear the loading message
        loadingMessage.textContent = "";

        // Check if matches are available
        if (matches.length === 0) {
            dropdown.innerHTML = "<option>No matches available</option>";
            return;
        }

        // Populate the dropdown with match data
        matches.forEach(match => {
            const option = document.createElement("option");
            option.value = match.id;
            option.text = `${match.homeTeam} vs ${match.awayTeam} (${match.status})`;
            dropdown.appendChild(option);
        });
    } catch (error) {
        console.error("Error fetching live matches:", error);
        loadingMessage.textContent = "Failed to load matches. Please try again later.";
    }
}

// Function to handle video generation
async function generatePreMatchVideo() {
    const dropdown = document.getElementById("match-dropdown");
    const resultDiv = document.getElementById("result");
    const selectedMatchId = dropdown.value;

    if (!selectedMatchId || selectedMatchId === "No matches available") {
        alert("Please select a valid match to generate the analysis video.");
        return;
    }

    try {
        // Show a loading message
        resultDiv.innerHTML = "<p>Generating video... Please wait.</p>";

        // Send a POST request to the backend
        const response = await fetch("https://tacticalai-b1b6e9ee43ed.herokuapp.com/generate-pre-match-video", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ matchId: selectedMatchId })
        });

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();

        // Display the video URL
        resultDiv.innerHTML = `
            <p>Video generated successfully!</p>
            <a href="${data.videoUrl}" target="_blank">Download Video</a>
        `;
    } catch (error) {
        console.error("Error generating pre-match video:", error);
        resultDiv.innerHTML = "<p>Failed to generate video. Please try again later.</p>";
    }
}

// Initialize the app when the page loads
document.addEventListener("DOMContentLoaded", () => {
    // Fetch live matches on page load
    fetchLiveMatches();

    // Attach event listener to the "Generate Analysis Video" button
    const generateButton = document.getElementById("generate-button");
    generateButton.addEventListener("click", generatePreMatchVideo);
});