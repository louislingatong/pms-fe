import React from 'react';
import {Pagination as BsPagination} from 'react-bootstrap';
import PropTypes from 'prop-types';

function Pagination({meta, onPageChange}) {
  const {totalElements, activePage, lastPage, pageSize,} = meta;

  const totalPages = Math.ceil(totalElements / pageSize);
  const firstFourPages = activePage < 4;
  const lastFourPages = totalPages - activePage < 5;

  const handlePageChange = (e) => {
    onPageChange(parseInt(e.target.innerText, 10));
  }

  const renderLinks = () => {
    let links = [];

    if (totalPages < 10) {
      links = getIntermediate(1, totalPages);
    } else {
      if (firstFourPages) {
        links = links.concat(getIntermediate(1, 5));
        links.push(
          <BsPagination.Ellipsis key="page_none" />
        );
        links.push(
          <BsPagination.Item
            key="page_last"
            active={lastPage === activePage}
            activeLabel=""
            onClick={handlePageChange}>
            {lastPage}
          </BsPagination.Item>,
        );
      } else if (lastFourPages) {
        links.push(
          <BsPagination.Item
            key="page_first"
            active={activePage === 1}
            activeLabel=""
            onClick={handlePageChange}>
            1
          </BsPagination.Item>,
        );
        links.push(
          <BsPagination.Ellipsis key="page_none" />,
        );
        links = links.concat(getIntermediate(totalPages - 5, totalPages));
      } else {
        links.push(
          <BsPagination.Item
            key="page_first"
            active={activePage === 1}
            activeLabel=""
            onClick={handlePageChange}>
            1
          </BsPagination.Item>,
        );
        links.push(
          <BsPagination.Ellipsis key="page_none" />,
        );
        links = links.concat(getIntermediate((activePage - 1) - 1, activePage + 2));
        links.push(
          <BsPagination.Ellipsis key="page_none_1" />,
        );
        links.push(
          <BsPagination.Item
            key="page_last"
            active={lastPage === activePage}
            activeLabel=""
            onClick={handlePageChange}>
            {lastPage}
          </BsPagination.Item>,
        );
      }
    }
    return links.map((item)=>item);
  };

  const getIntermediate = (from, to) => {
    const links = [];
    for (let i = from; i <= to; ++i) {
      links.push(
        <BsPagination.Item
          key={`page_${i}`}
          active={i === activePage}
          activeLabel=""
          onClick={handlePageChange}
        >
          {i}
        </BsPagination.Item>
      )
    }
    return links;
  };

  return (
    <BsPagination size="sm" className="no-margin">
      <BsPagination.Item
        disabled={activePage === 0}
        onClick={() => onPageChange(activePage - 1)}
      >
        «
      </BsPagination.Item>
      {renderLinks()}
      <BsPagination.Item
        disabled={lastPage === activePage}
        onClick={() => onPageChange(activePage + 1)}
      >
        »
      </BsPagination.Item>
    </BsPagination>
  )
}

Pagination.propTypes = {
  meta: PropTypes.object.isRequired,
  onPageChange: PropTypes.func.isRequired,
};

export default Pagination;
