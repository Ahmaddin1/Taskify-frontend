"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { useGSAP } from "@gsap/react";
import { Trash2, Edit2, Clock } from "lucide-react";
import { useRouter } from "next/navigation";
import gsap from "gsap";
import api from "@/lib/api";
import Welcome from "@/components/Welcome";

const API = "/tasks";
const WELCOME_STORAGE_KEY = "taskify:show-welcome";

gsap.registerPlugin(useGSAP);

const getNavigationType = () => {
  if (typeof performance === "undefined") return "navigate";

  const navigationEntry = performance.getEntriesByType("navigation")[0];
  if (navigationEntry?.type) {
    return navigationEntry.type;
  }

  const legacyNavigation = performance.navigation;

  if (legacyNavigation?.type === 1) {
    return "reload";
  }

  if (legacyNavigation?.type === 2) {
    return "back_forward";
  }

  return "navigate";
};

export default function Home() {
  const [task, settask] = useState("");
  const [desc, setdesc] = useState("");
  const [Storetask, setStoretask] = useState([]);
  const [expandedId, setexpandedId] = useState(null);
  const [editingId, setEditingId] = useState("");
  const [edittask, setEdittask] = useState("");
  const [editdesc, setEditdesc] = useState("");
  const [deadline, setdeadline] = useState("");
  const [editdeadline, setEditdeadline] = useState("");
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [isSessionReady, setIsSessionReady] = useState(false);
  const [isMainVisible, setIsMainVisible] = useState(false);
  const [showWelcome, setShowWelcome] = useState(false);
  const [welcomeName, setWelcomeName] = useState("");

  const router = useRouter();
  const rootref = useRef(null);
  const headref = useRef(null);
  const heading = useRef(null);
  const inputref = useRef(null);
  const tasksref = useRef(null);
  const emptyref = useRef(null);
  const editref = useRef(null);
  const editboxref = useRef(null);
  const itemrefs = useRef(new Map());
  const desctextrefs = useRef(new Map());
  const previdsref = useRef([]);

  const today = new Date().toLocaleDateString("en-US", {
    month: "long",
    day: "2-digit",
    year: "numeric",
  });

  const inputWrapClass =
    "rounded-[24px] bg-[#F0F0F0] shadow-[0_6px_16px_rgba(0,0,0,0.15)]";
  const fieldClass =
    "w-full rounded-[16px] border-none bg-[#D7D7D7] px-4 py-[0.7rem] text-black outline-none shadow-[6px_6px_12px_rgba(0,0,0,0.08),-6px_-6px_12px_rgba(255,255,255,0.9)] placeholder:text-black/55 focus:shadow-[inset_4px_4px_8px_rgba(0,0,0,0.08),inset_-4px_-4px_8px_rgba(255,255,255,0.9)]";
  const btnClass =
    "cursor-pointer rounded-[16px] border-none bg-[#F0F0F0] text-black shadow-[8px_8px_16px_rgba(0,0,0,0.08),-8px_-8px_16px_rgba(255,255,255,0.9)] transition-[box-shadow,transform] duration-200 hover:shadow-[10px_10px_18px_rgba(0,0,0,0.1),-10px_-10px_18px_rgba(255,255,255,0.92)] active:shadow-[inset_4px_4px_8px_rgba(0,0,0,0.1),inset_-4px_-4px_8px_rgba(255,255,255,0.92)]";
  const editModalBtn =
    "cursor-pointer rounded-[16px] border-none bg-[#E9E9E9] text-black shadow-[8px_8px_16px_rgba(0,0,0,0.08),-8px_-8px_16px_rgba(255,255,255,0.9)] transition-[box-shadow,transform] duration-200 hover:shadow-[10px_10px_18px_rgba(0,0,0,0.1),-10px_-10px_18px_rgba(255,255,255,0.92)] active:shadow-[inset_4px_4px_8px_rgba(0,0,0,0.1),inset_-4px_-4px_8px_rgba(255,255,255,0.92)]";
  const taskModalClass =
    "rounded-[24px] bg-[#E9E9E9] shadow-[14px_14px_28px_rgba(0,0,0,0.08),-14px_-14px_28px_rgba(255,255,255,0.9)]";
  const cardClass =
    "rounded-[20px] bg-[#EFEFEF] shadow-[7px_7px_14px_rgba(0,0,0,0.08),-7px_-7px_14px_rgba(255,255,255,0.9)]";
  const pillClass =
    "rounded-[16px] bg-[#F0F0F0] shadow-[6px_6px_12px_rgba(0,0,0,0.08),-6px_-6px_12px_rgba(255,255,255,0.9)]";
  const iconBtnClass =
    "inline-flex h-10 w-10 items-center justify-center rounded-[16px] border-none bg-[#F0F0F0] text-black shadow-[6px_6px_12px_rgba(0,0,0,0.08),-6px_-6px_12px_rgba(255,255,255,0.9)] transition-shadow duration-200 hover:shadow-[8px_8px_14px_rgba(0,0,0,0.1),-8px_-8px_14px_rgba(255,255,255,0.92)]";
  const editModalClass =
    "rounded-[24px] bg-[#DCDCDC] shadow-[18px_18px_34px_rgba(0,0,0,0.12),-18px_-18px_34px_rgba(255,255,255,0.92)]";
  const scrollClass =
    "[&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:border-2 [&::-webkit-scrollbar-thumb]:border-transparent [&::-webkit-scrollbar-thumb]:bg-black/20 [&::-webkit-scrollbar-thumb]:bg-clip-content [&::-webkit-scrollbar-thumb:hover]:bg-black/35";
  const logoutBtnClass =
    "inline-flex min-h-12 items-center justify-center rounded-[20px] border border-black/5 bg-[#F0F0F0] px-5 py-3 text-sm font-semibold text-black shadow-[2px_6px_10px_rgba(0,0,0,0.08),6px_12px_22px_rgba(0,0,0,0.12)] transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[3px_8px_12px_rgba(0,0,0,0.09),8px_16px_28px_rgba(0,0,0,0.14)] disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0";

  const clearSession = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    if (typeof window !== "undefined") {
      sessionStorage.removeItem(WELCOME_STORAGE_KEY);
    }
  };

  const handleWelcomeComplete = useCallback(() => {
    if (typeof window !== "undefined") {
      sessionStorage.removeItem(WELCOME_STORAGE_KEY);
    }

    setShowWelcome(false);
    setWelcomeName("");
    setIsMainVisible(true);
  }, []);

  useGSAP(
    () => {
      if (!isMainVisible || !rootref.current) return;

      const timeline = gsap.timeline({ defaults: { ease: "power3.out" } });
      const headitems = heading.current
        ? Array.from(heading.current.children)
        : [];

      timeline
        .from(headitems, {
          y: 100,
          duration: 1,
          stagger: 0.15,
        })
        .from(inputref.current, {
          opacity: 0,
          scale: 0.96,
        })
        .from(tasksref.current, {
          opacity: 0,
          y: 40,
        });
    },
    { scope: rootref, dependencies: [isMainVisible], revertOnUpdate: true },
  );

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.replace("/login");
      return;
    }

    let storedUser = null;

    try {
      storedUser = JSON.parse(localStorage.getItem("user") || "null");
    } catch {
      storedUser = null;
    }

    const name = storedUser?.name?.trim() || "";
    const isReload = getNavigationType() === "reload";
    const shouldShowFromAuth =
      sessionStorage.getItem(WELCOME_STORAGE_KEY) === "true";
    const shouldShowWelcome =
      Boolean(name) && (shouldShowFromAuth || isReload);

    setWelcomeName(name);
    setShowWelcome(shouldShowWelcome);
    setIsMainVisible(!shouldShowWelcome);
    setIsSessionReady(true);

    if (!shouldShowWelcome && typeof window !== "undefined") {
      sessionStorage.removeItem(WELCOME_STORAGE_KEY);
    }

    const fetchTasks = async () => {
      try {
        const { data } = await api.get("/tasks");
        setStoretask(data);
      } catch (error) {
        if (error.response?.status === 401) {
          clearSession();
          router.replace("/login");
        } else {
          toast.error("Failed to load tasks.");
        }
      }
    };

    fetchTasks();
  }, [router]);

  useEffect(() => {
    const interval = setInterval(() => {
      const now = Date.now();

      setStoretask((prevTasks) => {
        let changed = false;

        const updated = prevTasks
          .map((t) => {
            const timeLeft = t.deadline - now;

            if (timeLeft <= 30 * 60 * 1000 && timeLeft > 0 && !t.warned30Min) {
              toast.warning(`Task "${t.task}" is due in 30 minutes!`);
              changed = true;
              api
                .put(`${API}/${t._id}`, { ...t, warned30Min: true })
                .catch(() => {});
              return { ...t, warned30Min: true };
            }

            if (timeLeft <= 0) {
              toast.error(`Task "${t.task}" has expired.`);
              api.delete(`${API}/${t._id}`).catch(() => {});
              changed = true;
              return null;
            }

            return t;
          })
          .filter(Boolean);

        return changed ? updated : prevTasks;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (!isMainVisible) return;

    const currentTaskIds = Storetask.map((t) => t._id);
    const previousTaskIds = previdsref.current;
    const enteringTaskIds = currentTaskIds.filter(
      (id) => !previousTaskIds.includes(id),
    );

    const enteringElements = enteringTaskIds
      .map((id) => itemrefs.current.get(id))
      .filter(Boolean);

    if (enteringElements.length > 0) {
      gsap.fromTo(
        enteringElements,
        { opacity: 0, y: 16, scale: 0.98 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.35,
          ease: "power2.out",
          stagger: 0.05,
        },
      );
    }

    previdsref.current = currentTaskIds;
  }, [Storetask, isMainVisible]);

  useEffect(() => {
    if (!isMainVisible) return;

    if (Storetask.length === 0 && emptyref.current) {
      gsap.fromTo(
        emptyref.current,
        { opacity: 0, scale: 0.96 },
        { opacity: 1, scale: 1, duration: 0.35, ease: "power2.out" },
      );
    }
  }, [Storetask.length, isMainVisible]);

  useEffect(() => {
    if (!expandedId) return;
    const activeDesc = desctextrefs.current.get(expandedId);
    if (!activeDesc) return;

    gsap.fromTo(
      activeDesc,
      { opacity: 0, y: 10, height: 48 },
      {
        opacity: 1,
        y: 0,
        height: activeDesc.scrollHeight,
        duration: 0.35,
        ease: "power2.out",
        clearProps: "height",
      },
    );
  }, [expandedId]);

  useEffect(() => {
    if (editingId && editref.current && editboxref.current) {
      gsap.set(editref.current, { opacity: 0 });
      gsap.set(editboxref.current, { opacity: 0, scale: 0.94, y: 16 });

      gsap.to(editref.current, {
        opacity: 1,
        duration: 0.2,
        ease: "power2.out",
      });

      gsap.to(editboxref.current, {
        opacity: 1,
        scale: 1,
        y: 0,
        duration: 0.25,
        ease: "power2.out",
      });
    }
  }, [editingId]);

  const setTaskRef = (id) => (element) => {
    if (element) {
      itemrefs.current.set(id, element);
      return;
    }
    itemrefs.current.delete(id);
  };

  const setDescTextRef = (id) => (element) => {
    if (element) {
      desctextrefs.current.set(id, element);
      return;
    }
    desctextrefs.current.delete(id);
  };

  const toggleDesc = (id) => {
    setexpandedId(expandedId === id ? null : id);
  };

  const closeEditModal = () => {
    if (!editref.current || !editboxref.current) {
      setEditingId("");
      return;
    }

    gsap.to(editboxref.current, {
      opacity: 0,
      scale: 0.94,
      y: 16,
      duration: 0.2,
      ease: "power2.in",
    });

    gsap.to(editref.current, {
      opacity: 0,
      duration: 0.2,
      ease: "power2.in",
      onComplete: () => setEditingId(""),
    });
  };

  const handleLogout = async () => {
    if (
      typeof window !== "undefined" &&
      !window.confirm(
        "Logging out will delete your account and all saved tasks. Do you want to continue?",
      )
    ) {
      return;
    }

    setIsLoggingOut(true);

    try {
      await api.delete("/auth/logout");
      clearSession();
      setStoretask([]);
      toast.success("Account deleted and logged out.");
      router.replace("/signup");
    } catch (error) {
      if (error.response?.status === 401) {
        clearSession();
        router.replace("/login");
        toast.error("Session expired. Please log in again.");
      } else {
        toast.error(error.response?.data?.message || "Logout failed.");
      }
    } finally {
      setIsLoggingOut(false);
    }
  };

  const submitHandler = async (e) => {
    e.preventDefault();

    if (!task.trim() || !desc.trim() || !deadline) {
      toast.error("Please fill in all fields.");
      return;
    }

    const deadlineTime = new Date(deadline).getTime();

    if (deadlineTime <= Date.now()) {
      toast.error("Deadline must be in the future.");
      return;
    }

    try {
      const { data } = await api.post(API, {
        task,
        desc,
        deadline: deadlineTime,
      });

      setStoretask((prev) => [data, ...prev]);
      settask("");
      setdesc("");
      setdeadline("");
      toast.success("Task Added");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to add task.");
    }
  };
  const editHandler = (taskObj) => {
    setEditingId(taskObj._id);
    setEdittask(taskObj.task);
    setEditdesc(taskObj.desc);
    const datetime = new Date(taskObj.deadline);
    const local = new Date(
      datetime.getTime() - datetime.getTimezoneOffset() * 60000,
    )
      .toISOString()
      .slice(0, 16);
    setEditdeadline(local);
  };

  const saveEditHandler = async () => {
    const newDeadline = new Date(editdeadline).getTime();

    if (newDeadline <= Date.now()) {
      toast.error("Deadline must be in the future.");
      return;
    }

    try {
      const { data } = await api.put(`${API}/${editingId}`, {
        task: edittask,
        desc: editdesc,
        deadline: newDeadline,
        warned30Min: false,
      });

      setStoretask((prev) => prev.map((t) => (t._id === editingId ? data : t)));
      closeEditModal();
      toast.success("Task Updated");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update task.");
    }
  };
  const deleteHandler = (id) => {
    const taskElement = itemrefs.current.get(id);

    const performDelete = async () => {
      try {
        await api.delete(`${API}/${id}`);
        setStoretask((prev) => prev.filter((t) => t._id !== id));
        toast.success("Task Deleted");
      } catch (error) {
        toast.error(error.response?.data?.message || "Failed to delete task.");
      }
    };

    if (!taskElement) {
      performDelete();
      return;
    }

    gsap.to(taskElement, {
      opacity: 0,
      x: -70,
      scale: 0.96,
      duration: 0.22,
      ease: "power2.in",
      onComplete: performDelete,
    });
  };

  let rendertask = (
    <div ref={emptyref} className="py-12 text-center text-xl text-black/55">
      No active tasks. Time to relax or plan ahead!
    </div>
  );

  if (Storetask.length > 0) {
    rendertask = (
      <>
        {Storetask.map((t) => (
          <div
            ref={setTaskRef(t._id)}
            key={t._id}
            className={`${cardClass} mb-4 grid grid-cols-1 items-start gap-4 p-5 md:grid-cols-12`}
          >
            <div className="truncate text-2xl font-bold text-black md:col-span-3">
              {t.task}
            </div>

            <div className="min-w-0 text-black/75 md:col-span-5">
              <p
                ref={setDescTextRef(t._id)}
                className="break-words whitespace-pre-wrap leading-relaxed"
              >
                {expandedId === t._id
                  ? t.desc
                  : `${t.desc.slice(0, 30)}${t.desc.length > 30 ? "..." : ""}`}
                {t.desc.length > 30 && (
                  <button
                    type="button"
                    onClick={() => toggleDesc(t._id)}
                    className="ml-2 inline cursor-pointer text-sm font-semibold text-black underline underline-offset-2"
                  >
                    {expandedId === t._id ? "See Less" : "See More"}
                  </button>
                )}
              </p>
            </div>

            <div className="flex items-center gap-2 text-sm font-medium text-black/70 md:col-span-2">
              <Clock size={16} />
              <span className="truncate">
                {new Date(t.deadline).toLocaleString(undefined, {
                  month: "short",
                  day: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </span>
            </div>

            <div className="flex justify-end gap-3 md:col-span-2">
              <button
                onClick={() => editHandler(t)}
                className={iconBtnClass}
                title="Edit Task"
              >
                <Edit2 size={18} />
              </button>
              <button
                onClick={() => deleteHandler(t._id)}
                className={iconBtnClass}
                title="Delete Task"
              >
                <Trash2 size={18} />
              </button>
            </div>
          </div>
        ))}
      </>
    );
  }

  if (!isSessionReady) {
    return <div className="min-h-screen w-full bg-[#D7D7D7]" aria-hidden="true" />;
  }

  if (showWelcome) {
    return <Welcome name={welcomeName} onComplete={handleWelcomeComplete} />;
  }

  return (
    <div
      ref={rootref}
      className="capitalize min-h-screen w-full bg-[#D7D7D7] px-4 py-8 text-black md:px-10"
    >
      <div
        ref={headref}
        className="mx-auto mb-10 w-full max-w-6xl overflow-hidden"
      >
        <div
          ref={heading}
          className="grid gap-4 md:min-h-24 md:grid-cols-[auto_1fr_auto] md:items-center"
        >
          <div className="font-camood text-5xl font-bold text-black">
            Taskify
          </div>
          <h1 className="font-camood text-center text-3xl font-bold text-black md:text-5xl md:justify-self-center">
            {today}
          </h1>
          <div className="flex justify-start md:justify-end">
            <button
              type="button"
              onClick={handleLogout}
              disabled={isLoggingOut}
              className={logoutBtnClass}
            >
              {isLoggingOut ? "Logging Out..." : "Logout"}
            </button>
          </div>
        </div>
      </div>

      <div ref={inputref} className="mx-auto mb-8 w-full max-w-5xl">
        <form onSubmit={submitHandler} className="space-y-5">
          <div className={`${inputWrapClass} p-5 md:p-7`}>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-12">
              <div className="md:col-span-3">
                <label className="mb-2 block text-sm font-semibold text-black">
                  Task Name
                </label>
                <input
                  type="text"
                  value={task}
                  onChange={(e) => settask(e.target.value)}
                  placeholder="Enter task name"
                  className={`${fieldClass} h-12`}
                  required
                />
              </div>

              <div className="md:col-span-5">
                <label className="mb-2 block text-sm font-semibold text-black">
                  Task Description
                </label>
                <textarea
                  value={desc}
                  onChange={(e) => setdesc(e.target.value)}
                  placeholder="Describe your task"
                  className={`${fieldClass} ${scrollClass} min-h-12 resize-y py-3`}
                  rows={1}
                  required
                />
              </div>

              <div className="md:col-span-4">
                <label className="mb-2 block text-sm font-semibold text-black">
                  Deadline
                </label>
                <input
                  type="datetime-local"
                  value={deadline}
                  min={new Date().toISOString().slice(0, 16)}
                  onChange={(e) => setdeadline(e.target.value)}
                  className={`${fieldClass} h-12 cursor-pointer`}
                  required
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              className={`${btnClass} px-8 py-3 text-lg font-bold`}
            >
              Add Task
            </button>
          </div>
        </form>
      </div>

      <div ref={tasksref} className="mx-auto w-full max-w-5xl">
        <div className={`${taskModalClass} min-h-80 p-6 md:p-8`}>
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-2xl font-bold text-black">All Tasks</h2>
            <div
              className={`${pillClass} px-3 py-1 text-sm font-semibold text-black`}
            >
              {Storetask.length} {Storetask.length === 1 ? "Task" : "Tasks"}
            </div>
          </div>

          <div className={`${scrollClass} max-h-[50vh] overflow-y-auto pr-2`}>
            {rendertask}
          </div>
        </div>
      </div>

      {editingId && (
        <div
          ref={editref}
          className="fixed inset-0 z-100 flex items-center justify-center bg-[rgba(0,0,0,0.15)] p-4 backdrop-blur-md"
        >
          <div
            ref={editboxref}
            className={`${editModalClass} w-full max-w-lg p-8`}
          >
            <h2 className="mb-6 text-center text-3xl font-bold text-black">
              Edit Task
            </h2>

            <div className="space-y-5">
              <div>
                <label className="mb-2 ml-1 block text-xs font-semibold uppercase tracking-wider text-black/70">
                  Task Name
                </label>
                <input
                  type="text"
                  value={edittask}
                  onChange={(e) => setEdittask(e.target.value)}
                  className={fieldClass}
                  placeholder="Task title"
                />
              </div>

              <div>
                <label className="mb-2 ml-1 block text-xs font-semibold uppercase tracking-wider text-black/70">
                  Description
                </label>
                <textarea
                  value={editdesc}
                  onChange={(e) => setEditdesc(e.target.value)}
                  className={`${fieldClass} ${scrollClass} min-h-28 resize-y py-3`}
                  placeholder="Detailed description"
                />
              </div>

              <div>
                <label className="mb-2 ml-1 flex items-center gap-1 text-xs font-semibold uppercase tracking-wider text-black/70">
                  <Clock size={14} /> Deadline
                </label>
                <input
                  type="datetime-local"
                  value={editdeadline}
                  min={new Date().toISOString().slice(0, 16)}
                  onChange={(e) => setEditdeadline(e.target.value)}
                  className={`${fieldClass} cursor-pointer`}
                />
              </div>

              <div className="mt-6 flex justify-end gap-3 border-t border-black/10 pt-4 ">
                <button
                  onClick={closeEditModal}
                  className={`${editModalBtn} px-6 py-2.5 `}
                >
                  Cancel
                </button>

                <button
                  onClick={saveEditHandler}
                  className={`${editModalBtn} px-6 py-2.5 `}
                >
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
