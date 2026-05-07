'use client';

import { useAuthStore } from 'features';
import { cn } from 'shared/lib';

const INACTIVITY_LABEL = '30 minutes';

export const ProfilePage = () => {
  const user = useAuthStore(state => state.user);

  const email = user?.email ?? '—';
  const role = user?.role ?? '—';

  return (
    <div className="content">
      <div className="page-header">
        <div className="page-title">My Account</div>
        <div className="page-sub">Account information.</div>
      </div>

      <div className="max-w-[560px]">
        <div className="card">
          <div className={cn('card-header', 'px-3.5 py-3')}>
            <div className="card-title">Account</div>
          </div>
          <div className={cn('card-body', 'px-3.5 py-3')}>
            <div className="py-3">
              <div className="label pb-0.5">Email</div>
              <div className="font-medium leading-[1.35]">{email}</div>
            </div>
            <div className="divider" />
            <div className="py-3">
              <div className="label pb-0.5">Role</div>
              <div className="font-medium leading-[1.35]">{role}</div>
            </div>
            <div className="divider" />
            <div className="overflow-hidden py-3">
              <div className="float-right pl-4 font-medium leading-[1.35]">
                {INACTIVITY_LABEL}
              </div>
              <div>
                <div className="label pb-0.5">Inactivity timeout</div>
                <div className="hint leading-[1.35]">
                  Automatic sign-out after period of inactivity
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className={cn('hint', 'mt-3.5 text-[var(--ink-400)]')}>
          To reset your password, sign out and use the &ldquo;Forgot
          password?&rdquo; link on the sign-in page.
        </div>
      </div>
    </div>
  );
};
