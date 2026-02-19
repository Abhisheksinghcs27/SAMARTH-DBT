export const generateApplicationId = (): string => {
  const timestamp = Date.now().toString(36);
  const random = Math.random().toString(36).substring(2, 7);
  return `BT-${timestamp}-${random}`.toUpperCase();
};

export const generateGrievanceId = (): string => {
  const timestamp = Date.now().toString(36);
  const random = Math.random().toString(36).substring(2, 7);
  return `GR-${timestamp}-${random}`.toUpperCase();
};
