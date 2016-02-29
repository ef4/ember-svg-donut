import Ember from 'ember';
import layout from 'ember-svg-donut/templates/components/svg-donut';

export default Ember.Component.extend({
  layout,
  tagName: '',
  radius: 40,
  value: 1,
  max: 10,
  thickness: 0.5,

  fraction: Ember.computed('value', 'max', function() {
    return this.get('value') / this.get('max');
  }),

  innerRadius: Ember.computed('radius', 'thickness', function() {
    return this.get('radius') * (1 - this.get('thickness'));
  }),

  arcs: Ember.computed('radius', 'innerRadius', 'fraction', function() {
    let angle = Math.PI * 2 * parseFloat(this.get('fraction'), 10);
    let radius = this.get('radius');
    let innerRadius = this.get('innerRadius');

    let cos = Math.cos(angle);
    let sin = Math.sin(angle);

    let endPoint = {
      outer: {
        x: radius * cos,
        y: radius * sin
      },
      inner: {
        x: innerRadius * cos,
        y: innerRadius * sin
      }
    };

    if (angle <= Math.PI) {
      return {
        first: endPoint
      };
    } else {
      return {
        first: { outer: { x: -radius, y: 0 }, inner: { x: -innerRadius, y : 0 } },
        second: endPoint
      };
    }
  }),

  path: Ember.computed('radius', 'fraction', 'thickness', function() {
    let radius = this.get('radius');
    let innerRadius = this.get('innerRadius');
    let arcs = this.get('arcs');
    let open = this.get('fraction') < 1;

    if (this.get('fraction') == 0) { //jshint ignore:line
      return '';
    }

    let path = `
      M ${radius} 0
      A ${radius} ${radius} 0 0 1 ${arcs.first.outer.x} ${arcs.first.outer.y}
    `;

    if (arcs.second) {
      path += `
        A ${radius} ${radius} 0 0 1 ${arcs.second.outer.x} ${arcs.second.outer.y}
        ${open ? 'L' : 'M'} ${arcs.second.inner.x} ${arcs.second.inner.y}
        A ${innerRadius} ${innerRadius} 0 0 0 ${-innerRadius} 0
      `;
    } else {
      path += `
        L ${arcs.first.inner.x} ${arcs.first.inner.y}
      `;
    }
    path += `
      A ${innerRadius} ${innerRadius} 0 0 0 ${innerRadius} 0
      ${open ? 'Z' : ''}
    `;
    return path;
  })

});
