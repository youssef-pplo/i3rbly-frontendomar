import { useState } from 'react'
import AdSense from '../components/AdSense.jsx'
import { useApi, API_CONFIG } from '../lib/api'
import { renderAsLines, stripTashkeel, getI3rabText } from '../lib/text.jsx'

export default function Tool(){
  const { request } = useApi()
  const [sentence,setSentence] = useState('')
  const [html,setHtml] = useState('')
  const [loading,setLoading] = useState(false)
  const [copyStatus,setCopyStatus] = useState('')
  const [error,setError] = useState('')

  async function onSubmit(e){
    e?.preventDefault?.()
    if (loading) return
    if (!sentence.trim()) { setError('يرجى إدخال جملة صحيحة أولاً.'); return }
    setLoading(true)
    setHtml('')
    setError('')
    try{
      const res = await request(API_CONFIG.endpoints.parse, { method:'POST', body: JSON.stringify({ sentence }) })
      if (res?.html){
        setHtml(res.html)
      } else {
        const errMsg = res?.error === 'timeout'
          ? 'انتهت مهلة الطلب. يرجى المحاولة مجدداً بعد لحظات.'
          : 'حدث خطأ في التحليل. يرجى المحاولة مرة أخرى.'
        setError(errMsg)
      }
    }catch{
      setError('فشل في الاتصال بالخادم. تحقق من اتصال الإنترنت.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <section id="tool" className="section">
      <div className="container grid grid-2" style={{gridTemplateColumns:'1fr'}}>
        <div className="card">
          <h2 className="ruqaa ruqaa-invert" style={{ marginTop: '40px', marginBottom: '20px',textAlign:'center',fontSize:'clamp(92px,42vw,112px)',textShadow:'none'}}>أعربلي</h2>
          <form onSubmit={onSubmit} className="parse-form">
            <label htmlFor="sentence" className="form-label">اكتب الجملة المراد إعرابها *يفضل كتابة الجملة بالتشكيل لتفادي الأخطاء*</label>
            <input id="sentence" className="input" type="text" placeholder="مثال: ذَهَبَ الطَّالِبُ إِلَى الْمَدْرَسَةِ" value={sentence} onChange={e=> setSentence(e.target.value)} style={{marginBottom:'18px'}} />
            <div style={{marginTop:'24px'}}>
              <button className={`button primary cta-big glow ${loading?'is-loading':''}`} disabled={loading} style={{width:'100%',padding:'1.25rem 1.8rem',fontSize:'1.24rem'}}>أعربلي</button>
            </div>
          </form>
          {loading && <div className="loader-bar" aria-hidden="true"><span></span></div>}
        </div>
        <aside style={{gridColumn:'1 / -1'}}>
          {(loading || html) && (
            <div className="card" style={{marginTop:12}}>
              <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:10}}>
                <h3>نتيجة الأعراب</h3>
                <div style={{display:'flex',gap:8,alignItems:'center'}}>
                  <button className="button" onClick={async ()=> { await navigator.clipboard.writeText(getI3rabText(html, sentence)); setCopyStatus('تم النسخ مع التشكيل!'); setTimeout(()=> setCopyStatus(''),2000) }}>نسخ مع التشكيل</button>
                  <button className="button" onClick={async ()=> { await navigator.clipboard.writeText(stripTashkeel(getI3rabText(html, sentence))); setCopyStatus('تم النسخ بدون التشكيل!'); setTimeout(()=> setCopyStatus(''),2000) }}>نسخ بدون التشكيل</button>
                  {copyStatus && <span style={{color:'var(--neon)',fontSize:'0.9rem',fontWeight:'bold'}}>{copyStatus}</span>}
                </div>
              </div>
              {loading ? (
                <div className="parse-output">
                  <span className="token skeleton" style={{width:'30%'}}></span>
                  <span className="token skeleton" style={{width:'40%'}}></span>
                  <span className="token skeleton" style={{width:'35%'}}></span>
                </div>
              ) : error ? (
                <div style={{textAlign:'center', padding:20}}>
                  <div style={{color:'salmon', marginBottom:12}}>{error}</div>
                  <button className={`button ${loading?'is-loading':''}`} disabled={loading} onClick={onSubmit}>إعادة المحاولة</button>
                </div>
              ) : (
                <div className="parse-output">{renderAsLines(html, sentence)}</div>
              )}
            </div>
          )}
          <AdSense slot={import.meta.env.VITE_ADSENSE_SLOT_TOOL} className="responsive-ad" />
        </aside>
      </div>
    </section>
  )
}


