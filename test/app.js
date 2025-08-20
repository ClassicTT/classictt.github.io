document.addEventListener('DOMContentLoaded', () => {
    const blocksList = document.getElementById('blocks-list');
    const searchInput = document.getElementById('search-input');
    const searchButton = document.getElementById('search-button');
    const detailsSection = document.getElementById('details');
    const detailsContent = document.getElementById('details-content');

    // Using the Blockchair Kaspa API
    const API_BASE_URL = 'https://api.blockchair.com/kaspa';

    // Function to fetch and display the latest blocks
    async function fetchLatestBlocks() {
        try {
            // Blockchair's endpoint for latest blocks is 'dashboards/blocks'
            const response = await fetch(`${API_BASE_URL}/dashboards/blocks`);
            
            if (!response.ok) {
                throw new Error(`API request failed with status: ${response.status}`);
            }

            const data = await response.json();
            const blocks = data.data; // Blockchair nests the data under 'data'

            blocksList.innerHTML = '';
            if (Array.isArray(blocks)) {
                blocks.forEach(block => {
                    const blockDiv = document.createElement('div');
                    blockDiv.className = 'block-item';
                    blockDiv.innerHTML = `
                        <p><strong>Hash:</strong> ${block.hash}</p>
                        <p><strong>Time:</strong> ${new Date(block.time * 1000).toLocaleString()}</p>
                    `;
                    blocksList.appendChild(blockDiv);
                });
            } else {
                blocksList.innerHTML = '<p>Received unexpected data format from API.</p>';
            }
        } catch (error) {
            console.error('Error fetching blocks:', error);
            blocksList.innerHTML = '<p>Failed to load blocks. The Blockchair API may be down or has changed.</p>';
        }
    }

    // Function to search for a specific block by hash
    async function searchBlockchain() {
        const query = searchInput.value;
        if (!query) return;

        detailsSection.style.display = 'block';
        detailsContent.innerHTML = '<p>Loading...</p>';

        try {
            // Blockchair's endpoint for a specific block is 'dashboards/block/hashes' with the hash as a parameter
            const response = await fetch(`${API_BASE_URL}/dashboards/block/${query}`);

            if (!response.ok) {
                throw new Error(`API request failed with status: ${response.status}`);
            }
            const data = await response.json();
            const block = data.data.blocks[0]; // The data is structured differently here

            detailsContent.innerHTML = `
                <h3>Block Details</h3>
                <p><strong>Hash:</strong> ${block.hash}</p>
                <p><strong>Blue Score:</strong> ${block.block_id}</p>
                <p><strong>Number of Transactions:</strong> ${block.transaction_count}</p>
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