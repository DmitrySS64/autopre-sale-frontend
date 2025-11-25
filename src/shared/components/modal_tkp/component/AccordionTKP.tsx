import React, { useState } from 'react';
import '../style/AccordionTKP.css';
import { accordionData } from '../constants/DEFAULT_ACCORDION_DATA';


const AccordionTKP: React.FC = () => {
  const [openItems, setOpenItems] = useState<Set<string>>(new Set());
  

  const toggleItem = (id: string) => {
    setOpenItems(prev => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  const isItemOpen = (id: string) => openItems.has(id);

  return (
    <div className="accordion-tkp">
      <div className="accordion-items">
        {accordionData.map((item) => (
          <div key={item.id} className={`accordion-item ${isItemOpen(item.id) ? 'active' : ''}`}>
            <div 
              className="accordion-item-header"
              onClick={() => toggleItem(item.id)}
            >
              <h3 className="accordion-item-title">{item.title}</h3>
              <span className="accordion-icon">
                {!isItemOpen(item.id) ? '▼' : '▲'}
              </span>
            </div>
            
            <div className="accordion-item-content">
              {item.content.length > 0 && (
                <div className="content-grid">
                  {item.content.map((text, index) => (
                    <span key={index} className="content-text">
                      {text}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AccordionTKP;