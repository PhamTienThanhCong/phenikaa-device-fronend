import PropTypes from 'prop-types';

// base layout component
const BaseLayout = ({ children }) => {
  return (
    <div>
      <h3>header</h3>
      {children}
    </div>
  );
};

BaseLayout.propTypes = {
  children: PropTypes.node.isRequired
};

export default BaseLayout;
