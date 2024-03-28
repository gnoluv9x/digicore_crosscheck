export const tutorialSchema = {
  title: {
    exists: {
      errorMessage: 'Thiếu trường title',
      bail: true,
    },
    notEmpty: {
      errorMessage: 'Title không được để trống',
      bail: true,
    },
    isString: {
      errorMessage: 'Định dạng title phải là string',
      bail: true,
    },
  },
};
