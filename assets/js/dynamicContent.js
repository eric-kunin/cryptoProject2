$(function() {
    "use strict";

    // Define the content for each section
    function loadHomeContent() {
        $('.mainContainer').html(`
            <!-- parallax scroller video -->
    <div class="hero parallax-video">
        <video autoplay muted loop id="myVideo">
            <source src="./assets/vid/video.mp4" type="video/mp4">
        </video>
        <div class="content mt-5">
            <div class="container mt-5">
                <div class="row align-items-center">
                    <div class="col-md-6">
                        <h1>EXCHANGE PLATFORM</h1>
                        <h2>Create, hold or trade cryptocurrency</h2>
                        <p>Experience lightning-fast transactions with unbeatable security. Join the future!</p>
                        <a class="btn btn-secondary" href="#searchBar">Explore</a>
                    </div>
                </div>
                <div class="row mt-5 stats">
                    <div class="col-md-4 text-center">
                        <h3>5346</h3>
                        <p>Wallets</p>
                    </div>
                    <div class="col-md-4 text-center">
                        <h3>2453</h3>
                        <p>Clients</p>
                    </div>
                    <div class="col-md-4 text-center">
                        <h3>425</h3>
                        <p>Traders</p>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <div class="video-background">
        <video autoplay muted loop id="bg-video">
            <source src="./assets/vid/video2.mp4" type="video/mp4">
            Your browser does not support the video tag.
        </video>
    </div>
    <div class="container" id="searchBar">
        <section class="search-section py-3">
            <div class="container">
                <div class="search-container">
                    <input type="text" class="search-input" id="searchInput" placeholder="Search cryptocurrencies (e.g. BTC, ETH)">
                    <button class="btn btn-outline-success search-button">
                        <i class="bi bi-search"></i> Search
                    </button>
                    <div class="search-dropdown" id="searchDropdown"></div>
                    <!-- Add this element to display the search result message -->
                </div>
                <div id="searchResultMessage"></div>
            </div>
        </section>
        <!-- main -->
        <div class="main">
            <!-- display every 1 row with 4 coins here  -->
        </div>
        <!-- end of main -->
        <div class="modal fade mt-5" id="maxCoinsModal" tabindex="-1" aria-labelledby="maxCoinsModalLabel" aria-hidden="true">
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title" id="maxCoinsModalLabel">Max Coins Selected</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div class="modal-body">
                        <p>You have selected the maximum of 5 coins. Please deselect one before adding another.</p>
                        <div id="selectedCoinsContainer">
                            <!-- coin that user selected, display here -->
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button id="modalFooterBtn" type="button" class="btn btn-primary" data-bs-dismiss="modal">Okay</button>
                    </div>
                </div>
            </div>
        </div>
    <!-- end div container -->
        `);
    }

    function loadAboutContent() {
        $('.mainContainer').html(`
            <!-- parallax scroller video -->
    <div class="hero parallax-video">
        <video autoplay muted loop id="myVideo">
            <source src="./assets/vid/video.mp4" type="video/mp4">
        </video>
        <div class="content mt-5">
            <div class="container mt-5">
                <div class="row align-items-center">
                    <div class="col-md-6">
                        <h1>EXCHANGE PLATFORM</h1>
                        <h2>Create, hold or trade cryptocurrency</h2>
                        <p>Experience lightning-fast transactions with unbeatable security. Join the future!</p>
                        <!-- <button class="btn btn-secondary">Explore</button> -->
                        <a class="btn btn-secondary" href="#about">Explore</a>
                    </div>
                </div>
                <div class="row mt-5 stats">
                    <div class="col-md-4 text-center">
                        <h3>5346</h3>
                        <p>Wallets</p>
                    </div>
                    <div class="col-md-4 text-center">
                        <h3>2453</h3>
                        <p>Clients</p>
                    </div>
                    <div class="col-md-4 text-center">
                        <h3>425</h3>
                        <p>Traders</p>
                    </div>
                </div>
            </div>
        </div>
    </div>
    
        <div class="video-background">
            <video autoplay muted loop id="bg-video">
                <source src="./assets/vid/video2.mp4" type="video/mp4">
                Your browser does not support the video tag.
            </video>
        </div>

    <div class="containerAbout">
        <div class="about-platform container">
            <div class="about-image">
                <img src="./assets/img/bitcoinImgAbout.jpg" alt="Bitcoin coins">
            </div>
            <div class="about-content">
                <h2>About Platform</h2>
                <p class="pAbout">Dive into the world of cryptocurrencies with our advanced platform, designed to keep you updated with the latest prices of popular digital currencies. Whether you're a seasoned investor or just starting out, our platform provides real-time data and insights to help you make informed decisions. Join us as we navigate the exciting landscape of digital finance and step confidently into the future. Discover, invest and grow with us.</p>
                <a href="#about" class="explore-btn">Explore</a>
            </div>
        </div>
    </div>
    <div id="about" class="container mt-3">
        <div class="content-section">
            <div class="container">
                <h2>Why Choose CryptoM5?</h2>
                <div class="row mt-4">
                    <div class="col-md-4">
                        <h3>Secure Transactions</h3>
                        <p>Our platform uses state-of-the-art encryption to ensure your transactions are always secure.</p>
                    </div>
                    <div class="col-md-4">
                        <h3>24/7 Support</h3>
                        <p>Our dedicated team is always available to assist you with any queries or issues.</p>
                    </div>
                    <div class="col-md-4">
                        <h3>Low Fees</h3>
                        <p>Enjoy some of the lowest transaction fees in the industry.</p>
                    </div>
                </div>
            </div>
        </div>
    
        <div class="content-section">
            <div class="container">
                <h2>Latest Market Trends</h2>
                <div id="market-trends" class="row mt-4">
                    <!-- Market trends data will be dynamically inserted here -->
                </div>
            </div>
        </div>
    </div>
    
    <!-- traders cards -->
    <div class="containerTrader pt-4">
        <h1 class="traderTitle">Company Employees</h1>
        <div class="traderTeamGrid container pb-5">
            <div class="traderTeamMember">
                <img src="./assets/img/team1.jpg" alt="Eric Kunin">
                <div class="traderMemberInfo">
                    <div>
                        <h2 class="traderMemberName">Eric Kunin</h2>
                        <p class="traderMemberRole">Lead FullStack Developer</p>
                        <p class="traderMemberDescription">Eric oversees both backend and frontend development, ensuring seamless integration and security. He expertly manages all system components to deliver a cohesive user experience.</p>
                    </div>
                    <div class="traderSocialIcons">
                        <a href="https://www.facebook.com/" target="_blank"><i class="fab fa-facebook-f"></i></a>
                        <a href="https://x.com/" target="_blank"><i class="fab fa-twitter"></i></a>
                        <a href="https://www.instagram.com/" target="_blank"><i class="fab fa-instagram"></i></a>
                    </div>
                </div>
            </div>
            <div class="traderTeamMember">
                <img src="./assets/img/team2.jpg" alt="Sarah Palmer">
                <div class="traderMemberInfo">
                    <div>
                        <h2 class="traderMemberName">Sarah Palmer</h2>
                        <p class="traderMemberRole"> Senior Trading Analyst</p>
                        <p class="traderMemberDescription">Sarah develops and implements trading strategies for the team. Her deep understanding of market trends and financial instruments is key to maximizing profits and minimizing risks.</p>
                    </div>
                    <div class="traderSocialIcons">
                        <a href="https://www.facebook.com/" target="_blank"><i class="fab fa-facebook-f"></i></a>
                        <a href="https://x.com/" target="_blank"><i class="fab fa-twitter"></i></a>
                        <a href="https://www.instagram.com/" target="_blank"><i class="fab fa-instagram"></i></a>
                    </div>
                </div>
            </div>
            <div class="traderTeamMember">
                <img src="./assets/img/team3.jpg" alt="Filler Cat">
                <div class="traderMemberInfo">
                    <div>
                        <h2 class="traderMemberName">Filler Cat</h2>
                        <p class="traderMemberRole">Loyal Cat</p>
                        <p class="traderMemberDescription">Filler is the loyal cat of Lead Developer Eric, often keeping him company during late-night coding sessions. His curious nature and occasional keyboard strolls add a touch of warmth to the workspace.</p>
                    </div>
                    <div class="traderSocialIcons">
                        <a href="https://www.facebook.com/" target="_blank"><i class="fab fa-facebook-f"></i></a>
                        <a href="https://x.com/" target="_blank"><i class="fab fa-twitter"></i></a>
                        <a href="https://www.instagram.com/" target="_blank"><i class="fab fa-instagram"></i></a>
                    </div>
                </div>
            </div>
            <div class="traderTeamMember">
                <img src="./assets/img/team4.jpg" alt="Helen Smith">
                <div class="traderMemberInfo">
                    <div>
                        <h2 class="traderMemberName">Helen Smith</h2>
                        <p class="traderMemberRole">Junior Trader</p>
                        <p class="traderMemberDescription">Helen assists in executing trades and analyzing market data. Her keen attention to detail and strong analytical skills help in identifying profitable opportunities and refining trading strategies.</p>
                    </div>
                    <div class="traderSocialIcons">
                        <a href="https://www.facebook.com/" target="_blank"><i class="fab fa-facebook-f"></i></a>
                        <a href="https://x.com/" target="_blank"><i class="fab fa-twitter"></i></a>
                        <a href="https://www.instagram.com/" target="_blank"><i class="fab fa-instagram"></i></a>
                    </div>
                </div>
            </div>
        </div>
    </div>
        `);
    }

    function loadLiveReportsContent() {
        $('.main').html(`
            <!-- parallax scroller video -->
<div class="hero parallax-video">
    <video autoplay muted loop id="myVideo">
        <source src="./assets/vid/video.mp4" type="video/mp4">
    </video>
    <div class="content mt-5">
        <div class="container mt-5">
            <div class="row align-items-center">
                <div class="col-md-6">
                    <h1>EXCHANGE PLATFORM</h1>
                    <h2>Create, hold or trade cryptocurrency</h2>
                    <p>Experience lightning-fast transactions with unbeatable security. Join the future!</p>
                    <!-- <button class="btn btn-secondary">Explore</button> -->
                    <a class="btn btn-secondary" href="#liveReports">Explore</a>
                </div>
            </div>
            <div class="row mt-5 stats">
                <div class="col-md-4 text-center">
                    <h3>5346</h3>
                    <p>Wallets</p>
                </div>
                <div class="col-md-4 text-center">
                    <h3>2453</h3>
                    <p>Clients</p>
                </div>
                <div class="col-md-4 text-center">
                    <h3>425</h3>
                    <p>Traders</p>
                </div>
            </div>
        </div>
    </div>
</div>
    <div class="video-background">
        <video autoplay muted loop id="bg-video">
            <source src="./assets/vid/video2.mp4" type="video/mp4">
            Your browser does not support the video tag.
        </video>
    </div>

    <div id="liveReports" class="container mt-3">
        <div class="mainLiveReports">
            <h1 class="header">This is Live Reports:</h1>
            <div id="chartContainer"></div>
        </div>
    </div>
        `);
    }

    // Event listeners for navigation links
    $('#nav-home').on('click', function(e) {
        e.preventDefault();
        setActiveNavLink('#nav-home');
        loadHomeContent();
    });

    $('#nav-about').on('click', function(e) {
        e.preventDefault();
        setActiveNavLink('#nav-about');
        loadAboutContent();
    });

    $('#nav-live-reports').on('click', function(e) {
        e.preventDefault();
        setActiveNavLink('#nav-live-reports');
        loadLiveReportsContent();
    });

    // Function to set the active class on the clicked nav link
    function setActiveNavLink(activeNavId) {
        $('.nav-link').removeClass('active');
        $(activeNavId).addClass('active');
    }

    // Load initial content (Home by default)
    loadHomeContent();
});
