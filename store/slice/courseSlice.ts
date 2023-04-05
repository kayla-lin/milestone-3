import { StateCreator } from "zustand";

export interface UserType {
  enrolledCourse: string[];
}

export interface CourseSliceType {
  user: UserType;
  setUser: (user: UserType) => void;
}

export const createCourseSlice: StateCreator<CourseSliceType> = (set) => ({
  user: {
    enrolledCourse: [],
  },
  setUser: (user: UserType) => {
    set({ user });
  },
});
