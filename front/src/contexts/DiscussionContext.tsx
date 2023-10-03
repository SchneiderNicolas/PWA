import React, {
  createContext,
  useState,
  useContext,
  ReactNode,
  useCallback,
} from 'react';
import { useLocation } from 'react-router-dom';

interface ViewState {
  type: 'DISCUSSION' | 'NEW_DISCUSSION';
  discussionId: number | null;
}

interface IDiscussionContext {
  viewState: ViewState;
  showDiscussion: (id: number) => void;
  showNewDiscussion: () => void;
  forceUpdate: boolean;
  toggleForceUpdate: () => void;
  resetViewState: () => void;
}

const DiscussionContext = createContext<IDiscussionContext | undefined>(
  undefined,
);

export const useDiscussionContext = () => {
  const context = useContext(DiscussionContext);
  if (!context) {
    throw new Error(
      'useDiscussionContext must be used within a DiscussionProvider',
    );
  }
  return context;
};

interface DiscussionProviderProps {
  children: ReactNode;
}

export const DiscussionProvider = ({ children }: DiscussionProviderProps) => {
  const location = useLocation();

  const [forceUpdate, setForceUpdate] = useState<boolean>(false);

  const toggleForceUpdate = useCallback(() => {
    setForceUpdate((prev) => !prev);
  }, []);

  const initializeViewState = (): ViewState => {
    const path = location.pathname.toLowerCase();

    if (path.startsWith('/discussion/')) {
      const idSegment = path.replace('/discussion/', '');
      const discussionId = parseInt(idSegment, 10);

      if (!isNaN(discussionId)) {
        return { type: 'DISCUSSION', discussionId: discussionId };
      }
    } else if (path.startsWith('/new')) {
      return { type: 'NEW_DISCUSSION', discussionId: null };
    }

    return { type: 'NEW_DISCUSSION', discussionId: null };
  };

  const [viewState, setViewState] = useState<ViewState>(initializeViewState);

  const showDiscussion = useCallback((id: number) => {
    setViewState({ type: 'DISCUSSION', discussionId: id });
  }, []);

  const showNewDiscussion = useCallback(() => {
    setViewState({ type: 'NEW_DISCUSSION', discussionId: null });
  }, []);

  const resetViewState = useCallback(() => {
    setViewState({ type: 'NEW_DISCUSSION', discussionId: null });
  }, []);

  return (
    <DiscussionContext.Provider
      value={{
        viewState,
        showDiscussion,
        showNewDiscussion,
        forceUpdate,
        toggleForceUpdate,
        resetViewState,
      }}
    >
      {children}
    </DiscussionContext.Provider>
  );
};
