import { useAppDispatch, useAppSelector } from '@/app/hooks';
import { useEffect } from 'react';
import { getAllDemo } from './BasicApi';
import BaseLayout from '@/features/layout/BaseLayout';

const BasicPage = () => {
  const { users, isGetUser } = useAppSelector((state) => state.demo);
  const dispatch = useAppDispatch();

  // useEffect(() => {
  //   if (!isGetUser) {
  //     dispatch(getAllDemo());
  //   }
  // }, [dispatch, isGetUser]);

  const reloadData = () => {
    dispatch(getAllDemo());
  };

  return (
    <BaseLayout>
      <div>
        <h1>Basic Page</h1>
        <button onClick={() => reloadData()}>Load</button>
        {isGetUser && (
          <ul>
            {users.map((user) => (
              <li key={user.id}>{user.email}</li>
            ))}
          </ul>
        )}
      </div>
    </BaseLayout>
  );
};

export default BasicPage;
