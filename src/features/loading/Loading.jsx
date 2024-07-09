import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { usePromiseTracker } from 'react-promise-tracker';
import './Loading.scss';

function Loading() {
  const { promiseInProgress } = usePromiseTracker({ delay: 1000 });

  const value = useSelector((state) => state.loading.value);
  const timer = useSelector((state) => state.loading.timer);
  const [isShow, setIsShow] = useState(false);

  useEffect(() => {
    if (timer > 0) {
      let timeout = null;
      if (value) {
        timeout = setTimeout(() => {
          return setIsShow(true);
        }, timer);
      } else {
        setIsShow(false);
      }
      return () => {
        clearTimeout(timeout);
      };
    } else {
      setIsShow(value);
    }
  }, [value, timer]);

  const _onContextMenu = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const _onDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    e.dataTransfer.effectAllowed = 'none';
    e.dataTransfer.dropEffect = 'none';
  };

  const _render = () => {
    return (
      <div
        id="loading-container"
        className="loading-container w-100 h-100 position-fixed show"
        onContextMenu={_onContextMenu}
        onDragOver={_onDragOver}
      >
        <div className="d-flex align-items-center justify-content-center w-100 h-100">
          <div className="loading-panel text-center text-white pt-4">
            <div className="loading-icon loading-spinner m-auto" />
            <div className="loading-text">Loading</div>
          </div>
        </div>
      </div>
    );
  };

  return promiseInProgress ? _render() : isShow && _render();
}

export default Loading;
