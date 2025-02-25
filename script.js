const API_KEY = 'AIzaSyCH_RQKrQhJX7OtKuZ4ysfbsuzT87sDF6Q';

async function fetchTalks() {
    const searchType = document.getElementById("searchType").value;
    const query = document.getElementById("query").value;
    const maxResults = document.getElementById("maxResults").value;

    let searchQuery = "TEDx";
    if (searchType === "conference") {
        searchQuery += ` ${query}`;
    } else if (searchType === "topic") {
        searchQuery += ` ${query}`;
    }

    const searchUrl = `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${encodeURIComponent(searchQuery)}&type=video&order=viewCount&maxResults=${maxResults}&key=${API_KEY}`;

    try {
        const searchResponse = await fetch(searchUrl);
        const searchData = await searchResponse.json();

        if (!searchData.items) {
            console.error("No results found.");
            return;
        }

        // Extract video IDs to get view counts
        const videoIds = searchData.items.map(video => video.id.videoId).join(',');

        // Second API call to get video statistics (views, likes, etc.)
        const statsUrl = `https://www.googleapis.com/youtube/v3/videos?part=statistics&id=${videoIds}&key=${API_KEY}`;
        const statsResponse = await fetch(statsUrl);
        const statsData = await statsResponse.json();

        const resultsDiv = document.getElementById("results");
        resultsDiv.innerHTML = ""; // Clear previous results

        searchData.items.forEach((video, index) => {
            const videoId = video.id.videoId;
            const title = video.snippet.title;
            const thumbnailUrl = video.snippet.thumbnails.medium.url;
            const views = statsData.items[index]?.statistics.viewCount || 0;

            // Create a video card
            const videoCard = document.createElement("div");
            videoCard.classList.add("video-card");
            videoCard.innerHTML = `
                <img src="${thumbnailUrl}" alt="Thumbnail of ${title}" class="video-thumbnail">
                <div class="video-info">
                    <a href="https://www.youtube.com/watch?v=${videoId}" target="_blank" class="video-title">${title}</a>
                    <p class="video-views">${views.toLocaleString()} views</p>
                </div>
            `;

            resultsDiv.appendChild(videoCard);
        });
    } catch (error) {
        console.error("Error fetching TEDx talks:", error);
    }
}
