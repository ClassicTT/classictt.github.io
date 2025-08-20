document.addEventListener('DOMContentLoaded', () => {
    const blocksList = document.getElementById('blocks-list');
    const searchInput = document.getElementById('search-input');
    const searchButton = document.getElementById('search-button');
    const detailsSection = document.getElementById('details');
    const detailsContent = document.getElementById('details-content');

    const API_BASE_URL = 'https://api.kaspa.live/v1';

    async function fetchLatestBlocks() {
        try {
            const response = await fetch(`${API_BASE_URL}/blocks?limit=10`);
            if (!response.ok) {
                throw new Error('API request failed with status: ' + response.status);
            }
            const data = await response.json();
            const blocks = data.data;

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
            blocksList.innerHTML = '<p>Failed to load blocks. Please check the API URL.</p>';
        }
    }

    async function searchBlockchain() {
        const query = searchInput.value;
        if (!query) return;

        detailsSection.style.display = 'block';
        detailsContent.innerHTML = '<p>Loading...</p>';

        try {
            const response = await fetch(`${API_BASE_URL}/blocks/${query}`);
            if (!response.ok) {
                throw new Error('API request failed with status: ' + response.status);
            }
            const data = await response.json();
            const block = data.data; 

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

    searchButton.addEventListener('click', searchBlockchain);
    searchInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            searchBlockchain();
        }
    });

    fetchLatestBlocks();
});