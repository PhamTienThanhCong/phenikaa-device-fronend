export const DEFAULT_BOOKING = {
  id: 0,
  name: "loading...",
  room: {
    category: "loading...",
    house_name: "loading...",
    manager: "loading...",
    detail: [
      {
        name: "loading...",
        total: 0
      },
      {
        name: "loading...",
        total: 0
      }
    ],
    note: "loading...",
    is_active: false,
    is_using: false,
    is_maintenance: false,
    room_id: "loading..."
  },
  user: {
    id: 0,
    full_name: "loading...",
    email: "loading...",
    role: 0,
    is_active: 0,
    profile: {
      id: 0,
      user_id: 0,
      full_name: "loading...",
      avatar: "loading...",
      birth_date: "loading...",
      gender: 0,
      address: "loading...",
      phone_number: "loading...",
      card_id: "loading..."
    }
  },
  customer: {
    id: 0,
    role: 0,
    email: "loading...",
    full_name: "loading...",
    avatar: "loading...",
    birth_date: "loading...",
    gender: 0,
    address: "loading...",
    phone_number: "loading...",
    card_id: "loading...",
    date_start: "loading...",
    expired: 0,
    department: "loading...",
    status: 0
  },
  total_customer: 0,
  date_booking: "loading...",
  start_time: "loading...",
  end_time: "loading...",
  note: "loading...",
  created_at: "loading...",
  updated_at: "loading...",
  status: "loading...",
  is_active: false
};

export const DEFAULT_DEVICE_LOAN = {
  id: 0,
  name: "loading...",
  devices: [
    {
      quantity: 0,
      device: {
        id: 0,
        name: "loading...",
        category: "loading...",
        information: "loading...",
        note: "loading...",
        total: 0,
        image: "loading...",
        total_used: 0,
        total_maintenance: 0,
        is_active: 0
      }
    }
  ],
  user: {
    id: 0,
    full_name: "loading...",
    email: "loading...",
    role: 0,
    is_active: 0,
    profile: {
      id: 0,
      user_id: 0,
      full_name: "loading...",
      avatar: "loading...",
      birth_date: "loading...",
      gender: 0,
      address: "loading...",
      phone_number: "loading...",
      card_id: "loading..."
    }
  },
  customer: {
    id: 0,
    role: 0,
    email: "loading...",
    full_name: "loading...",
    avatar: "loading...",
    birth_date: "loading...",
    gender: 0,
    address: "loading...",
    phone_number: "loading...",
    card_id: "loading...",
    date_start: "loading...",
    expired: 0,
    department: "loading...",
    status: 0
  },
  note: "loading...",
  returning_date: "loading...",
  is_returned: false,
  status: "loading...",
  retired_date: null,
  created_at: "loading..."
};
