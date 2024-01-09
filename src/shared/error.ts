const map: Record<string, string> = {
  "is invalid": "格式错误",
};
export const getFriendlyError = (error: string) => {
  return map[error] || error;
};
