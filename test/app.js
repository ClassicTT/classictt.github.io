document.addEventListener('DOMContentLoaded', () => {
    const blocksList = document.getElementById('blocks-list');
    const searchInput = document.getElementById('search-input');
    const searchButton = document.getElementById('search-button');
    const detailsSection = document.getElementById('details');
    const detailsContent = document.getElementById('details-content');

    // Use a public Kaspa explorer API with CORS enabled.
    // NOTE: This API is from a community-run project and may change.
    const API_BASE_URL = 'https://api.kaspa.org/info';

    // Function to fetch and display the latest blocks
    async function fetchLatestBlocks() {
        try {
            // This endpoint seems to be a more reliable one.
            const response = await fetch(`${API_BASE_URL}/blocks?limit=10`);
            
            if (!response.ok) {
                throw new Error('API request failed with status: ' + response.status);
            }

            const blocks = await response.json();

            blocksList.innerHTML = '';
            // The JSON response is an array of objects
            if (Array.isArray(blocks)) {
                blocks.forEach(block => {
                    const blockDiv = document.createElement('div');
                    blockDiv.className = 'block-item';
                    blockDiv.innerHTML = `
                        <p><strong>Hash:</strong> ${block.hash}</p>
                        <p><strong>Time:</strong> ${new Date(block.timestamp).toLocaleString()}</p>
                    `;
                    blocksList.appendChild(blockDiv);
                });
            } else {
                blocksList.innerHTML = '<p>Received unexpected data format from API.</p>';
            }
        } catch (error) {
            console.error('Error fetching blocks:', error);
            blocksList.innerHTML = '<p>Failed to load blocks. The API endpoint may be down or has changed.</p>';
        }
    }

    // Function to search for a specific block by hash
    async function searchBlockchain() {
        const query = searchInput.value;
        if (!query) return;

        detailsSection.style.display = 'block';
        detailsContent.innerHTML = '<p>Loading...</p>';

        try {
            // Endpoint to get a specific block by hash
            const response = await fetch(`${API_BASE_URL}/block/${query}`);

            if (!response.ok) {
                throw new Error('API request failed with status: ' + response.status);
            }
            const block = await response.json();
            
            detailsContent.innerHTML = `
                <h3>Block Details</h3>
                <p><strong>Hash:</strong> ${block.hash}</p>
                <p><strong>Blue Score:</strong> ${block.blueScore}</p>
                <p><strong>Number of Transactions:</strong> ${block.transactionIds.length}</p>
            `;
        } catch (error) {
            console.error('Error searching:', error);
            detailsContent.innerHTML = '<p>Not found or invalid block hash. Please enter a valid block hash.</p>';
        }
    }

    // Event listeners
    searchButton.addEventListener('click', searchBlockchain);
    searchInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            searchBlockchain();
        }
    });

    // Initial load
    fetchLatestBlocks();
});