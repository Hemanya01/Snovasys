import React, { useMemo, useState } from 'react';

const initialAccounts = [
  { id: 'BV-2048', name: 'Olivia Rhye', email: 'olivia@acme.co', type: 'Business', balance: 24850.00, status: 'Active', date: 'Nov 08, 2026' },
  { id: 'BV-2047', name: 'Phoenix Baker', email: 'phoenix@acme.co', type: 'Personal', balance: 12400.50, status: 'Active', date: 'Nov 07, 2026' },
  { id: 'BV-2046', name: 'Lana Steiner', email: 'lana@acme.co', type: 'Business', balance: 8750.00, status: 'Review', date: 'Nov 06, 2026' },
  { id: 'BV-2045', name: 'Demi Wilkinson', email: 'demi@acme.co', type: 'Personal', balance: 5320.75, status: 'Active', date: 'Nov 05, 2026' },
  { id: 'BV-2044', name: 'Candice Wu', email: 'candice@acme.co', type: 'Personal', balance: 21900.00, status: 'Suspended', date: 'Nov 03, 2026' }
];

const initialRequests = [
  { id: 'ONB-0912', name: 'Marcus Johnson', email: 'marcus@email.com', type: 'Business', submitted: 'Today, 10:42 AM', status: 'Pending', initials: 'MJ' },
  { id: 'ONB-0911', name: 'Ava Patel', email: 'ava@email.com', type: 'Personal', submitted: 'Today, 09:18 AM', status: 'Pending', initials: 'AP' },
  { id: 'ONB-0910', name: 'Noah Williams', email: 'noah@email.com', type: 'Business', submitted: 'Yesterday', status: 'Review', initials: 'NW' }
];

const initialLogs = [
  { action: 'Account status updated', actor: 'Sarah Admin', target: 'BV-2044 · Candice Wu', time: 'Today, 11:24 AM', severity: 'Warning', icon: '↻' },
  { action: 'Onboarding application approved', actor: 'James Wilson', target: 'ONB-0909 · Ethan Hunt', time: 'Today, 10:51 AM', severity: 'Success', icon: '✓' },
  { action: 'New account created', actor: 'System', target: 'BV-2048 · Olivia Rhye', time: 'Today, 10:32 AM', severity: 'Success', icon: '+' },
  { action: 'Failed login attempt', actor: 'Unknown', target: 'admin@balancevault.io', time: 'Today, 09:46 AM', severity: 'Alert', icon: '!' },
  { action: 'User role changed', actor: 'Sarah Admin', target: 'Phoenix Baker · Member', time: 'Yesterday, 04:18 PM', severity: 'Info', icon: '⇄' }
];

const nav = [
  { section: 'WORKSPACE', items: [['Overview','▦'],['Accounts','▣'],['Onboarding','↗']] },
  { section: 'MANAGEMENT', items: [['Users & roles','♙'],['Audit logs','≋']] },
  { section: 'PREFERENCES', items: [['Settings','⚙']] }
];
const money = n => new Intl.NumberFormat('en-US', { style:'currency', currency:'USD' }).format(n);
const initials = name => name.split(' ').map(x => x[0]).slice(0,2).join('').toUpperCase();

function App() {
  const [page, setPage] = useState('Overview');
  const [accounts, setAccounts] = useState(initialAccounts);
  const [requests, setRequests] = useState(initialRequests);
  const [logs, setLogs] = useState(initialLogs);
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState('All');
  const [modal, setModal] = useState(false);
  const [notice, setNotice] = useState('');
  const [form, setForm] = useState({ name:'', email:'', type:'Personal' });

  const filteredAccounts = useMemo(() => accounts.filter(a =>
    [a.name,a.email,a.id,a.status].join(' ').toLowerCase().includes(query.toLowerCase()) &&
    (filter === 'All' || a.status === filter)
  ), [accounts, query, filter]);

  const flash = msg => { setNotice(msg); window.setTimeout(() => setNotice(''), 2800); };
  const addLog = (action, target) => setLogs(prev => [{ action, actor:'You · Admin', target, time:'Just now', severity:'Success', icon:'✓' }, ...prev]);
  const createAccount = e => {
    e.preventDefault();
    if (!form.name.trim() || !form.email.trim()) return;
    const id = `BV-${2050 + accounts.length}`;
    setAccounts(prev => [{ id, name:form.name, email:form.email, type:form.type, balance:0, status:'Active', date:'Nov 12, 2026' }, ...prev]);
    addLog('New account created', `${id} · ${form.name}`);
    setForm({ name:'', email:'', type:'Personal' }); setModal(false); flash('Account created successfully.');
  };
  const decideRequest = (id, status) => {
    const item = requests.find(r => r.id === id);
    setRequests(prev => prev.map(r => r.id === id ? {...r,status} : r));
    addLog(`Onboarding ${status.toLowerCase()}`, `${id} · ${item?.name}`);
    flash(`Application ${status.toLowerCase()}.`);
  };
  const toggleStatus = id => {
    setAccounts(prev => prev.map(a => a.id === id ? {...a,status:a.status === 'Suspended' ? 'Active' : 'Suspended'} : a));
    const item = accounts.find(a => a.id === id);
    addLog('Account status updated', `${id} · ${item?.name}`);
    flash('Account status updated.');
  };

  return <div className="app-shell">
    <aside className="sidebar">
      <div className="brand"><div className="brand-mark">B</div><span>balance<span className="brand-light">vault</span></span></div>
      <div className="workspace-switch"><div className="workspace-icon">BV</div><div><b>BalanceVault Inc.</b><small>Workspace</small></div><span className="chevron">⌄</span></div>
      <nav>{nav.map(group => <div className="nav-group" key={group.section}><div className="nav-label">{group.section}</div>{group.items.map(([label,icon]) => <button key={label} className={`nav-link ${page===label?'active':''}`} onClick={()=>{setPage(label);setQuery('');setFilter('All')}}><span className="nav-icon">{icon}</span>{label}{label==='Onboarding' && <span className="nav-count">{requests.filter(r=>r.status==='Pending').length}</span>}</button>)}</div>)}</nav>
      <div className="sidebar-bottom"><div className="help-card"><div className="help-icon">?</div><b>Need a hand?</b><p>Visit our help center for guides and support.</p><button onClick={()=>flash('Help center will be available soon.')}>Visit help center ↗</button></div><div className="profile"><div className="avatar admin">JD</div><div className="profile-info"><b>Jordan Davis</b><small>Administrator</small></div><button className="more" onClick={()=>flash('Profile menu opened.')}>•••</button></div></div>
    </aside>

    <main className="main">
      <header className="topbar"><div className="breadcrumb">Workspace <span>/</span> <b>{page}</b></div><div className="top-actions"><div className="secure-label"><span></span> Secure environment</div><button className="icon-btn" aria-label="Notifications" onClick={()=>flash('You are all caught up.')}>♧<i></i></button><div className="top-avatar">JD</div></div></header>
      <div className="content">
        {page==='Overview' && <Overview accounts={accounts} requests={requests} logs={logs} setPage={setPage} />}
        {page==='Accounts' && <><PageHeading eyebrow="ACCOUNT MANAGEMENT" title="Accounts" desc="Manage account records, statuses and account-holder details." action={<button className="primary-btn" onClick={()=>setModal(true)}>＋ Create account</button>} /><div className="toolbar"><div className="search"><span>⌕</span><input value={query} onChange={e=>setQuery(e.target.value)} placeholder="Search by name, email or account ID..." /></div><select value={filter} onChange={e=>setFilter(e.target.value)}><option>All</option><option>Active</option><option>Review</option><option>Suspended</option></select></div><AccountsTable accounts={filteredAccounts} toggleStatus={toggleStatus} /></>}
        {page==='Onboarding' && <><PageHeading eyebrow="CUSTOMER LIFECYCLE" title="Onboarding" desc="Review applications and manage account-holder onboarding." /><div className="stats-row compact"><Stat label="Total applications" value={requests.length.toString()} change="All submissions" /><Stat label="Pending review" value={requests.filter(r=>r.status==='Pending').length.toString()} change="Requires attention" /><Stat label="Approved" value={requests.filter(r=>r.status==='Approved').length.toString()} change="Completed" /></div><div className="section-heading"><div><h2>Applications</h2><p>Review submitted account applications.</p></div><span className="table-count">{requests.length} applications</span></div><div className="table-wrap"><table><thead><tr><th>APPLICANT</th><th>APPLICATION ID</th><th>ACCOUNT TYPE</th><th>SUBMITTED</th><th>STATUS</th><th>ACTIONS</th></tr></thead><tbody>{requests.map(r=><tr key={r.id}><td><div className="person"><div className="avatar">{r.initials}</div><div><b>{r.name}</b><small>{r.email}</small></div></div></td><td className="mono">{r.id}</td><td>{r.type}</td><td>{r.submitted}</td><td><Status value={r.status}/></td><td>{r.status==='Pending'||r.status==='Review'?<div className="action-group"><button className="text-action green" onClick={()=>decideRequest(r.id,'Approved')}>Approve</button><button className="text-action red" onClick={()=>decideRequest(r.id,'Rejected')}>Reject</button></div>:<span className="muted">Completed</span>}</td></tr>)}</tbody></table></div></>}
        {page==='Users & roles' && <><PageHeading eyebrow="ACCESS CONTROL" title="Users & roles" desc="Manage workspace users and their access permissions." action={<button className="primary-btn" onClick={()=>flash('Invite flow is ready for backend integration.')}>＋ Invite user</button>} /><div className="info-banner"><span>ⓘ</span><div><b>Role-based access control</b><p>Assign the minimum permissions required for each team member. Changes should be reviewed and recorded in the audit log.</p></div></div><div className="table-wrap"><table><thead><tr><th>USER</th><th>ROLE</th><th>ACCESS SCOPE</th><th>LAST ACTIVE</th><th>STATUS</th></tr></thead><tbody>{[{name:'Jordan Davis',email:'jordan@balancevault.io',role:'Administrator',scope:'Full access',last:'Active now',status:'Active'},{name:'Sarah Admin',email:'sarah@balancevault.io',role:'Administrator',scope:'Full access',last:'12 minutes ago',status:'Active'},{name:'James Wilson',email:'james@balancevault.io',role:'Operations',scope:'Accounts, onboarding',last:'1 hour ago',status:'Active'},{name:'Olivia Rhye',email:'olivia@acme.co',role:'Member',scope:'Own account',last:'Yesterday',status:'Active'}].map(u=><tr key={u.email}><td><div className="person"><div className="avatar">{initials(u.name)}</div><div><b>{u.name}</b><small>{u.email}</small></div></div></td><td><span className="role-chip">{u.role}</span></td><td>{u.scope}</td><td>{u.last}</td><td><Status value={u.status}/></td></tr>)}</tbody></table></div></>}
        {page==='Audit logs' && <><PageHeading eyebrow="SECURITY & COMPLIANCE" title="Audit logs" desc="A chronological record of important account and administrative activity." /><div className="info-banner"><span>◈</span><div><b>Accountability by design</b><p>Audit events shown here are sample UI data. In production, logs should be append-only, server-generated and protected from modification.</p></div></div><div className="toolbar"><div className="search"><span>⌕</span><input value={query} onChange={e=>setQuery(e.target.value)} placeholder="Search events, actors or targets..." /></div><button className="outline-btn" onClick={()=>{setQuery('');flash('Filters cleared.')}}>↺ Clear filters</button></div><div className="table-wrap"><table><thead><tr><th>EVENT</th><th>ACTOR</th><th>TARGET</th><th>DATE & TIME</th><th>RESULT</th></tr></thead><tbody>{logs.filter(l=>[l.action,l.actor,l.target].join(' ').toLowerCase().includes(query.toLowerCase())).map((l,i)=><tr key={i}><td><div className="event-cell"><span className={`event-icon ${l.severity.toLowerCase()}`}>{l.icon}</span><b>{l.action}</b></div></td><td>{l.actor}</td><td className="muted">{l.target}</td><td>{l.time}</td><td><Status value={l.severity}/></td></tr>)}</tbody></table></div></>}
        {page==='Settings' && <><PageHeading eyebrow="WORKSPACE CONFIGURATION" title="Settings" desc="Manage workspace preferences and security configuration." /><div className="settings-grid"><div className="settings-card"><div className="settings-symbol">♙</div><h3>Organization profile</h3><p>Workspace name, contact details and organization information.</p><button onClick={()=>flash('Organization settings are ready for backend integration.')}>Manage settings ↗</button></div><div className="settings-card"><div className="settings-symbol">⌑</div><h3>Authentication</h3><p>Configure sign-in policies, session controls and password requirements.</p><button onClick={()=>flash('Authentication settings are ready for backend integration.')}>Configure ↗</button></div><div className="settings-card"><div className="settings-symbol">⛨</div><h3>API & integrations</h3><p>Connect trusted services and manage API credentials.</p><button onClick={()=>flash('Integrations settings are ready for backend integration.')}>View integrations ↗</button></div><div className="settings-card"><div className="settings-symbol">◷</div><h3>Rate limiting</h3><p>Backend request throttling and abuse protection configuration.</p><button onClick={()=>flash('Redis rate limiting must be configured on the backend.')}>View configuration ↗</button></div></div></>}
      </div>
      <footer className="footer"><span>© 2026 BalanceVault, Inc.</span><span><i className="green-dot"></i> All systems operational <span className="footer-divider">·</span> v1.0.0</span></footer>
    </main>
    {modal && <div className="modal-backdrop" onMouseDown={e=>e.target===e.currentTarget&&setModal(false)}><form className="modal" onSubmit={createAccount}><div className="modal-top"><div><span className="eyebrow">NEW ACCOUNT</span><h2>Create account</h2><p>Add an account holder to BalanceVault.</p></div><button type="button" className="close-btn" onClick={()=>setModal(false)}>×</button></div><label>Account holder name<input required value={form.name} onChange={e=>setForm({...form,name:e.target.value})} placeholder="e.g. Alex Morgan" /></label><label>Email address<input required type="email" value={form.email} onChange={e=>setForm({...form,email:e.target.value})} placeholder="alex@example.com" /></label><label>Account type<select value={form.type} onChange={e=>setForm({...form,type:e.target.value})}><option>Personal</option><option>Business</option></select></label><div className="modal-note">A new account will be created with Active status and a zero opening balance. Connect the backend before using this with real financial data.</div><div className="modal-actions"><button type="button" className="outline-btn" onClick={()=>setModal(false)}>Cancel</button><button className="primary-btn" type="submit">Create account</button></div></form></div>}
    {notice && <div className="toast"><span>✓</span>{notice}</div>}
  </div>;
}

function PageHeading({eyebrow,title,desc,action}) { return <div className="page-heading"><div><div className="eyebrow">{eyebrow}</div><h1>{title}</h1><p>{desc}</p></div>{action}</div>; }
function Stat({label,value,change,trend='up'}) { return <div className="stat-card"><div className="stat-top"><span>{label}</span><span className="stat-dots">•••</span></div><div className="stat-value">{value}</div><div className="stat-foot"><span className={`trend ${trend}`}>{trend==='up'?'↗':'•'} {change}</span></div></div>; }
function Status({value}) { const cls = value.toLowerCase().replaceAll(' ','-'); return <span className={`status ${cls}`}><i></i>{value}</span>; }
function AccountsTable({accounts,toggleStatus}) { return <div className="table-wrap"><table><thead><tr><th>ACCOUNT HOLDER</th><th>ACCOUNT ID</th><th>TYPE</th><th>BALANCE</th><th>STATUS</th><th>CREATED</th><th></th></tr></thead><tbody>{accounts.map(a=><tr key={a.id}><td><div className="person"><div className="avatar">{initials(a.name)}</div><div><b>{a.name}</b><small>{a.email}</small></div></div></td><td className="mono">{a.id}</td><td>{a.type}</td><td className="amount">{money(a.balance)}</td><td><Status value={a.status}/></td><td>{a.date}</td><td><button className="row-menu" title="Toggle account status" onClick={()=>toggleStatus(a.id)}>•••</button></td></tr>)}</tbody></table>{accounts.length===0&&<div className="empty">No accounts match your search.</div>}</div>; }
function Overview({accounts,requests,logs,setPage}) {
  const total = accounts.reduce((s,a)=>s+a.balance,0);
  return <><div className="welcome-row"><div><div className="eyebrow">THURSDAY, NOVEMBER 12, 2026</div><h1>Good morning, Jordan <span>✦</span></h1><p>Here’s what’s happening with your accounts today.</p></div><button className="primary-btn" onClick={()=>setPage('Accounts')}>View accounts <span>→</span></button></div>
    <div className="stats-row"><Stat label="Total account balance" value={money(total)} change="Across all accounts" /><Stat label="Total accounts" value={accounts.length.toString()} change="Registered holders" /><Stat label="Pending onboarding" value={requests.filter(r=>r.status==='Pending').length.toString()} change="Needs your review" trend="neutral" /><Stat label="Active accounts" value={accounts.filter(a=>a.status==='Active').length.toString()} change="Currently in good standing" /></div>
    <div className="overview-grid"><section className="panel balance-panel"><div className="panel-heading"><div><h2>Account overview</h2><p>Account status distribution</p></div><button className="subtle-link" onClick={()=>setPage('Accounts')}>View all ↗</button></div><div className="balance-content"><div className="donut"><div><strong>{accounts.length}</strong><small>Accounts</small></div></div><div className="legend"><div><i className="legend-dot active-dot"></i><span>Active</span><b>{accounts.filter(a=>a.status==='Active').length}</b></div><div><i className="legend-dot review-dot"></i><span>Under review</span><b>{accounts.filter(a=>a.status==='Review').length}</b></div><div><i className="legend-dot suspended-dot"></i><span>Suspended</span><b>{accounts.filter(a=>a.status==='Suspended').length}</b></div></div></div><div className="panel-bottom-note"><span>ⓘ</span> Account balances are sample display data.</div></section>
      <section className="panel onboarding-panel"><div className="panel-heading"><div><h2>Onboarding requests</h2><p>Applications waiting for review</p></div><button className="subtle-link" onClick={()=>setPage('Onboarding')}>View all ↗</button></div>{requests.filter(r=>r.status==='Pending'||r.status==='Review').slice(0,3).map(r=><div className="request-row" key={r.id}><div className="avatar">{r.initials}</div><div className="request-person"><b>{r.name}</b><small>{r.type} account · {r.submitted}</small></div><Status value={r.status}/></div>)}{requests.every(r=>r.status!=='Pending'&&r.status!=='Review')&&<div className="empty">All applications reviewed.</div>}</section>
    </div>
    <section className="panel recent-panel"><div className="panel-heading"><div><h2>Recent activity</h2><p>Latest actions across your workspace</p></div><button className="subtle-link" onClick={()=>setPage('Audit logs')}>View audit log ↗</button></div><div className="activity-list">{logs.slice(0,4).map((l,i)=><div className="activity-row" key={i}><div className={`event-icon ${l.severity.toLowerCase()}`}>{l.icon}</div><div className="activity-main"><b>{l.action}</b><small>{l.actor} <span>·</span> {l.target}</small></div><time>{l.time}</time></div>)}</div></section>
  </>;
}

export default App;