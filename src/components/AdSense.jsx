import { useEffect, useRef } from 'react'

// Simple Google AdSense wrapper
// Usage: <AdSense className="responsive-ad" format="auto" layout="" client="ca-pub-2789303242179184" slot="YOUR_SLOT_ID" responsive="true" />
export default function AdSense({ className = '', style, client = 'ca-pub-2789303242179184', slot, format = 'auto', layout = '', responsive = 'true' }){
  const containerRef = useRef(null)

  useEffect(() => {
    // Ensure AdSense script is present
    const scriptSrc = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${client}`
    const isLoaded = Array.from(document.scripts).some(s => s.src?.startsWith('https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js'))
    if (!isLoaded) {
      const s = document.createElement('script')
      s.async = true
      s.src = scriptSrc
      s.crossOrigin = 'anonymous'
      document.head.appendChild(s)
    }

    // Try to push ad when ready
    let timeoutId
    function pushAd(){
      try {
        // eslint-disable-next-line no-undef
        ;(window.adsbygoogle = window.adsbygoogle || []).push({})
      } catch (e) {
        // Retry once after a small delay in case script not ready
        clearTimeout(timeoutId)
        timeoutId = setTimeout(() => {
          try { /* eslint-disable no-undef */ (window.adsbygoogle = window.adsbygoogle || []).push({}) /* eslint-enable */ } catch {}
        }, 500)
      }
    }

    // Only push if the ins element exists and a slot is provided
    if (containerRef.current && slot) pushAd()

    return () => clearTimeout(timeoutId)
  }, [client, slot])

  if (!slot) return null

  return (
    <div className={`adsense-container ${className}`.trim()} style={style}>
      <ins
        ref={containerRef}
        className="adsbygoogle"
        style={{ display: 'block' }}
        data-ad-client={client}
        data-ad-slot={slot}
        data-ad-format={format}
        data-ad-layout={layout}
        data-full-width-responsive={responsive}
      />
    </div>
  )
}


