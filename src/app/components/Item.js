import React, {useEffect, useState} from 'react';
import {Link, useHistory} from 'react-router-dom';
import classnames from 'classnames';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import Transform from '../utils/Transformer';

function Item(props) {
  const {
    id,
    icon = 'far-circle',
    text,
    to: path,
    children
  } = props;

  const history = useHistory();

  const pathName = history.location.pathname;
  const hasChildren = !!(children);
  const hasIcon = !!(icon);
  const hasActiveChild = Array.isArray(children) && children.some(child => child.key === pathName);
  const isActive = path ? path === pathName : false;

  const localIcon = hasIcon ? Transform.toIcon(icon) : null;

  const renderContent = (
    <React.Fragment>
      <FontAwesomeIcon
        icon={localIcon}
        style={{marginRight: '6px'}}
      />
      {' '}
      <span>{text}</span>
      {
        (hasChildren) && (
          <span className="pull-right-container">
            {hasChildren && <FontAwesomeIcon className="pull-right" icon="angle-left"/>}
          </span>
        )
      }
    </React.Fragment>
  );

  const liClasses = classnames({
    'active': isActive,
    'treeview': hasChildren,
    'menu-open': hasActiveChild,
    'highlighted': isActive,
  });

  return (
    <li className={liClasses} id={id}>
      {
        path
          ? <Link to={path}>{renderContent}</Link>
          : <a href="#">{renderContent}</a>
      }
      {
        hasChildren && (
          <ul className="treeview-menu" style={{display: hasActiveChild ? 'block' : 'none'}}>
            {children}
          </ul>
        )
      }
    </li>
  );
}

Item.propTypes = {};

export default Item;
