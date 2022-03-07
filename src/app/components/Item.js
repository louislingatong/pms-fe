import React, {useEffect, useState} from 'react';
import {Link, useHistory} from 'react-router-dom';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import Transform from '../utils/Transformer';

function Item(props) {
  const {id, icon = 'far-circle', text, to: path, labels, color, activeOn, hasActiveChild, highlighted = false, children} = props;

  const history = useHistory();

  const [isActive, setIsActive] = useState(false);

  const hasChildren = !!(children);
  const hasIcon = !!(icon);

  useEffect(() => {
    const pathname = history.location.pathname;
    // console.log(hasChildren, path, pathname);
    if (hasChildren && path === pathname) {
      // console.log(path);
      setIsActive(true);
    }
  }, [path]);

  const localIcon = hasIcon ? Transform.toIcon(icon) : null;

  // let activeChild = false;
  // let localChildren = false;
  // if (hasChildren) {
  //   if (!Array.isArray(children)) {
  //     localChildren = [children];
  //   } else {
  //     localChildren = children;
  //   }
  //
  //   localChildren = localChildren.filter(p => p && p instanceof Component).map((p) => React.cloneElement(p, { key: p.props.to }));
  //
  //   activeChild = !!(localChildren.find((p) => checkActive()));
  // }

  const renderContent = (
    <React.Fragment>
      <FontAwesomeIcon
        icon={localIcon}
        style={{ marginRight: '6px' }}
      />
      {' '}
      <span>{text}</span>
      {
        (hasChildren) && (
          <span className="pull-right-container">
            {hasChildren && <FontAwesomeIcon className="pull-right" icon="angle-left" />}
          </span>
        )
      }
    </React.Fragment>
  );

  // const checkActive = () => {
  //   const { location } = history || {};
  //   const { pathname } = location || { pathname: '' };
  //   // let activeArray = [];
  //   // if (activeOn) {
  //   //   activeArray = (activeOn.length && typeof activeOn !== 'string' ? activeOn : [activeOn]);
  //   // }
  //
  //   return path === pathname;
  // };


  const liClasses = classnames({
    'active': isActive,
    'treeview': hasChildren,
    'menu-open': isActive,
    'highlighted': highlighted,
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
          <ul className="treeview-menu" style={{ display: isActive ? 'block' : 'none' }}>
            {children}
          </ul>
        )
      }
    </li>
  );
}

Item.propTypes = {};

export default Item;
