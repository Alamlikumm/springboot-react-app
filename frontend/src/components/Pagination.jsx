import React from 'react';

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
    if (totalPages <= 1) return null;

    const renderPageNumbers = () => {
        const pages = [];
        const maxPagesToShow = 5;
        
        let startPage = Math.max(0, currentPage - Math.floor(maxPagesToShow / 2));
        let endPage = Math.min(totalPages - 1, startPage + maxPagesToShow - 1);

        if (endPage - startPage + 1 < maxPagesToShow) {
            startPage = Math.max(0, endPage - maxPagesToShow + 1);
        }

        for (let i = startPage; i <= endPage; i++) {
            pages.push(
                <button
                    key={i}
                    onClick={() => onPageChange(i)}
                    className={`page-btn ${currentPage === i ? 'active' : ''}`}
                >
                    {i + 1}
                </button>
            );
        }
        return pages;
    };

    return (
        <div className="pagination">
            <button 
                className="page-btn nav-btn" 
                disabled={currentPage === 0}
                onClick={() => onPageChange(currentPage - 1)}
            >
                &laquo; Prev
            </button>
            
            <div className="page-numbers">
                {renderPageNumbers()}
            </div>

            <button 
                className="page-btn nav-btn" 
                disabled={currentPage === totalPages - 1}
                onClick={() => onPageChange(currentPage + 1)}
            >
                Next &raquo;
            </button>
        </div>
    );
};

export default Pagination;
