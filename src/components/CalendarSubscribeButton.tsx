import { faCalendarPlus } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Dialog, DialogPanel, DialogTitle, Transition, TransitionChild } from '@headlessui/react';
import { CheckIcon, DocumentDuplicateIcon } from '@heroicons/react/16/solid';
import React, { useState } from 'react';
import { useCopyToClipboard } from 'usehooks-ts';

interface SubscribeModalProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

const SubscribeModal: React.FC<SubscribeModalProps> = ({ isOpen, setIsOpen }) => {
  const [, copy] = useCopyToClipboard();
  const [copied, setCopied] = useState(false);

  const closeModal = () => {
    setIsOpen(false);
  };

  return (
    <Transition appear show={isOpen}>
      <Dialog className="relative z-10" onClose={closeModal}>
        <TransitionChild
          enter="ease-out duration-300"
          enterFrom="opacity-0 transform-[scale(95%)]"
          enterTo="opacity-100 transform-[scale(100%)]"
          leave="ease-in duration-200"
          leaveFrom="opacity-100 transform-[scale(100%)]"
          leaveTo="opacity-0 transform-[scale(95%)]"
        >
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
        </TransitionChild>

        <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
          <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
            <TransitionChild
              enter="ease-out duration-300"
              enterFrom="opacity-0 transform-[scale(95%)]"
              enterTo="opacity-100 transform-[scale(100%)]"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 transform-[scale(100%)]"
              leaveTo="opacity-0 transform-[scale(95%)]"
            >
              <DialogPanel className="relative transform overflow-hidden rounded-lg bg-white dark:bg-gray-500 px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:p-6">
                <div>
                  <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-yellow-400 text-white">
                    <FontAwesomeIcon icon={faCalendarPlus} size="xl" />
                  </div>
                  <div className="mt-3 text-center sm:mt-5">
                    <DialogTitle
                      as="h3"
                      className="text-base font-semibold leading-6 text-slate-900 dark:text-slate-100"
                    >
                      Add to Calendar
                    </DialogTitle>
                    <p className="text-slate-700 my-2 dark:text-slate-50">
                      Copy the link below to subscribe by URL in your calendar app. It will update
                      automatically as the shutdown schedule changes.
                    </p>
                    <button
                      onMouseLeave={() => setCopied(false)}
                      onClick={() => {
                        copy('https://shutdowns.labs.transitmatters.org/calendar');
                        setCopied(true);
                      }}
                      className="flex items-center justify-between gap-x-3 w-full px-4 py-2.5 lowercase bg-slate-400 hover:bg-slate-500 text-slate-50 rounded"
                    >
                      <div className="pr-3 font-normal text-sm">
                        https://shutdowns.labs.transitmatters.org/calendar
                      </div>
                      {copied ? (
                        <CheckIcon className="h-4 w-4 text-slate-50" />
                      ) : (
                        <DocumentDuplicateIcon className="h-4 w-4 text-slate-50" />
                      )}
                    </button>
                  </div>
                </div>
                <div className="mt-5 sm:mt-6">
                  <button
                    type="button"
                    className="inline-flex w-full justify-center rounded-md bg-yellow-400 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-yellow-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-yellow-600"
                    onClick={closeModal}
                  >
                    Back to tracker
                  </button>
                </div>
              </DialogPanel>
            </TransitionChild>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};

export const CalendarSubscribeButton: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  const openModal = React.useCallback(() => {
    setIsOpen(true);
  }, []);

  return (
    <button
      title={'Add to Calendar'}
      onClick={openModal}
      className={`p-2 group rounded-full sm:rounded-lg flex items-center justify-center text-white focus:outline-none h-1/2 bg-yellow-500`}
    >
      <span className="flex items-center">
        <FontAwesomeIcon icon={faCalendarPlus} />
        <span className="hidden group-hover:block p-0 text-xs ml-1">Add to Calendar</span>
      </span>
      <SubscribeModal isOpen={isOpen} setIsOpen={setIsOpen} />
    </button>
  );
};
