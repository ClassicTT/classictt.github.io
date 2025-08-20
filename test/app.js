document.addEventListener('DOMContentLoaded', () => {
    const blocksList = document.getElementById('blocks-list');
    const searchInput = document.getElementById('search-input');
    const searchButton = document.getElementById('search-button');
    const detailsSection = document.getElementById('details');
    const detailsContent = document.getElementById('details-content');

    // Use a public CORS proxy URL
    const CORS_PROXY_URL = 'https://corsproxy.io/?';

    // A working Kaspa API that has the desired endpoints
    const API_BASE_URL = 'https://api.kaspa.live/v1';

    // Function to fetch and display the latest blocks
    async function fetchLatestBlocks() {
        try {
            // Encode the original API URL to be a valid part of the proxy URL
            const url = `${CORS_PROXY_URL}${encodeURIComponent(`${API_BASE_URL}/blocks?limit=10`)}`;
            const response = await fetch(url);
            
            if (!response.ok) {
                throw new Error('API request failed with status: ' + response.status);
            }
            const data = await response.json();
            const blocks = data.data; // Data is nested under the 'data' key

            blocksList.innerHTML = '';
            if (Array.isArray(blocks)) {
                blocks.forEach(block => {
                    const blockDiv = document.createElement('div');
                    blockDiv.className = 'block-item';
                    blockDiv.innerHTML = `
                        <p><strong>Hash:</strong> ${block.block_hash}</p>
                        <p><strong>Time:</strong> ${new Date(block.timestamp).toLocaleString()}</p>
                    `;
                    blocksList.appendChild(blockDiv);
                });
            } else {
                blocksList.innerHTML = '<p>Received unexpected data format from API.</p>';
            }
        } catch (error) {
            console.error('Error fetching blocks:', error);
            blocksList.innerHTML = '<p>Failed to load blocks. Please check the API URL or proxy status.</p>';
        }
    }

    // Function to search for a specific block by hash
    async function searchBlockchain() {
        const query = searchInput.value;
        if (!query) return;

        detailsSection.style.display = 'block';
        detailsContent.innerHTML = '<p>Loading...</p>';

        try {
            // Encode the original search API URL
            const url = `${CORS_PROXY_URL}${encodeURIComponent(`${API_BASE_URL}/blocks/${query}`)}`;
            const response = await fetch(url);

            if (!response.ok) {
                throw new Error('API request failed with status: ' + response.status);
            }
            const data = await response.json();
            const block = data.data; // Data is nested under the 'data' key

            detailsContent.innerHTML = `
                <h3>Block Details</h3>
                <p><strong>Hash:</strong> ${block.block_hash}</p>
                <p><strong>Blue Score:</strong> ${block.blue_score}</p>
                <p><strong>Number of Transactions:</strong> ${block.transaction_count}</p>
            `;
        } catch (error) {
            console.error('Error searching:', error);
            detailsContent.innerHTML = '<p>Not found or invalid block hash. Please enter a valid block hash.</p>';
        }
    }

    // Event listeners remain the same
    searchButton.addEventListener('click', searchBlockchain);
    searchInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            searchBlockchain();
        }
    });

    // Initial load
    fetchLatestBlocks();
});