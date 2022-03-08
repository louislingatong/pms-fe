import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import Transform from '../utils/Transformer';

function Entry(props) {
  const {
    icon,
    label,
    header,
    footer,
    onFooterClick,
    className,
    children,
    onClick,
  } = props;

  const hasChildren = !!(children)
  const hasIcon = !!(icon);
  const hasLabel = !!(label);

  const localIcon = hasIcon ? Transform.toIcon(icon) : null;

  const listClasses = classnames('navbar-menu', {'dropdown': children}, className);

  return (
    <li className={listClasses} onClick={onClick}>
      <a href="/" data-toggle="dropdown">
        {hasIcon && <FontAwesomeIcon icon={localIcon} className="margin-r-5"/>}
        {hasLabel && label}
      </a>
      {
        hasChildren && (
          <ul className="dropdown-menu">
            {
              header && <li className="header">{header}</li>
            }
            <li>
              <ul className="menu">{children}</ul>
            </li>
            {
              footer && (
                <li onClick={onFooterClick}
                    onKeyPress={onFooterClick}
                    className="footer">
                  {footer}
                </li>
              )
            }
          </ul>
        )
      }
    </li>
  );
}

Entry.propTypes = {
  size: PropTypes.oneOf(['sm', 'md', 'lg', 'xl']),
};

export default Entry;
