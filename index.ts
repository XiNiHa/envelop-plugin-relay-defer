import { isAsyncIterable, mapAsyncIterator, type Plugin } from "@envelop/core";

interface Options {
  keepHasNext: boolean;
}

const relayDeferPlugin = (options?: Partial<Options>): Plugin => {
  const merged: Options = Object.assign({ keepHasNext: true }, options);
  return {
    onExecute() {
      return {
        onExecuteDone({ result, setResult }) {
          if (isAsyncIterable(result)) {
            setResult(
              mapAsyncIterator(result, (chunk) => {
                const { hasNext, ...rest } = chunk;
                if (hasNext == null) return chunk;
                return {
                  ...rest,
                  ...(merged.keepHasNext ? { hasNext } : {}),
                  extensions: {
                    ...rest.extensions,
                    is_final: !hasNext,
                  },
                };
              })
            );
          }
        },
      };
    },
  };
};

export default relayDeferPlugin;
