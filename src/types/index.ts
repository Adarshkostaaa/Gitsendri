export interface User {
  id: string;
  email: string;
  username: string;
  phone: string;
  created_at: string;
}

export interface Course {
  id: string;
  name: string;
  price: number;
  description: string;
  image: string;
  category: string;
  level: string;
  duration: string;
  instructor: string;
  driveLink: string;
}

export interface Purchase {
  id: string;
  user_id: string;
  course_id: string;
  course_name: string;
  user_name: string;
  user_email: string;
  user_phone: string;
  amount: number;
  payment_status: 'pending' | 'approved' | 'rejected';
  created_at: string;
  approved_at?: string;
}

export interface UserCourse {
  id: string;
  user_id: string;
  course_id: string;
  course: Course;
  purchased_at: string;
}
