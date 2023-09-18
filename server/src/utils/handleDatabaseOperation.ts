const MAX_RETRIES = 3;

export const handleDatabaseOperation = (operation: Function) => {
  return async (req: any, res: any, next: any) => {
    let retries = 0;

    while (retries < MAX_RETRIES) {
      try {
        await operation(req, res);
        return;
      } catch (err) {
        console.error(`Database error: ${err}, Retry count: ${retries + 1}`);
        retries++;

        if (retries >= MAX_RETRIES) {
          console.error(
            `Max retries reached. Cannot execute database operation.`
          );
          next(err);
          return;
        }
        await new Promise((resolve) => setTimeout(resolve, 1000));
      }
    }
  };
};
