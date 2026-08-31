import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

export function NotFoundPage() {
  return <div className="page container not-found"><span className="error-code">404</span><h1>这里还没有搭好</h1><p>这个页面不存在，回到首页继续探索吧。</p><Link className="button button-primary" to="/"><ArrowLeft size={18} /> 返回首页</Link></div>;
}
