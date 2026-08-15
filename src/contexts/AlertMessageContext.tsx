"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

import Alert, { AlertMessage } from "@/components/ui/alert";

import { v4 as uuidv4 } from "uuid";
import { tv, VariantProps } from "tailwind-variants";

type AlertMessageContextType = {
  showAlertMessage: (message: Partial<AlertMessage>) => void;
  closeAlertMessage: (id: string) => void;
};

const AlertMessageContext = createContext<AlertMessageContextType>(
  null as unknown as AlertMessageContextType,
);

const alertProvider = tv({
  base: "flex fixed w-auto h-auto z-50 flex-col gap-2 p-4",
  variants: {
    position: {
      top: "top-0 right-1/2 translate-x-1/2",
      "top-right": "top-0 right-0",
      "top-left": "top-0 left-0",
      bottom: "bottom-0 right-1/2 translate-x-1/2",
      "bottom-right": "bottom-0 right-0",
      "bottom-left": "bottom-0 left-0",
    },
  },
});

type AlertProviderProps = VariantProps<typeof alertProvider>;

export function AlertMessageProvider({
  children,
  position,
}: {
  children: React.ReactNode;
} & AlertProviderProps) {
  const [alertMessage, setAlertMessage] = useState<Array<AlertMessage>>([]);

  useEffect(() => {
    return () => {
      setAlertMessage([]);
    };
  }, []);

  const handleSetAlertMessage = useCallback(
    (message: Partial<AlertMessage> | null) => {
      if (!message) {
        return;
      }

      const id = uuidv4();

      const newMessage: AlertMessage = {
        id,
        title: message.title ?? "",
        message: message.message ?? "",
        close: message.close ?? false,
        autoClose: message.autoClose ?? true,
        timeToClose: message.timeToClose,
        type: message.type ?? "info",
      };

      setAlertMessage((state) => [
        newMessage,
        ...state.filter((msg) => msg.id !== id),
      ]);
    },
    [],
  );

  const handleRemoveAlertMessage = useCallback((id: string) => {
    setAlertMessage((state) =>
      state.filter((alertMessage) => alertMessage.id !== id),
    );
  }, []);

  const values: AlertMessageContextType = useMemo(
    () => ({
      showAlertMessage: handleSetAlertMessage,
      closeAlertMessage: handleRemoveAlertMessage,
    }),
    [handleRemoveAlertMessage, handleSetAlertMessage],
  );

  return (
    <AlertMessageContext.Provider value={values}>
      <div className={alertProvider({ position })}>
        {alertMessage.map((message) => (
          <Alert
            key={message.id}
            id={message.id}
            title={message?.title}
            message={message?.message}
            autoClose={message.autoClose}
            timeToClose={message.timeToClose}
            close={message?.close ?? true}
            type={message?.type}
          />
        ))}
      </div>

      {children}
    </AlertMessageContext.Provider>
  );
}

export const useAlert = () => useContext(AlertMessageContext);
