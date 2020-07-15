declare const $: any;


export const run = (data, tableId = '', tableTitle = '') => {
  $(document).ready(() => {
    const tId = (tableId) ? tableId : 'data_table';

    setTimeout(() => {
      const table = $(`#${tId}`).DataTable({
        lengthChange: false,
        order: [],

        buttons: [

          {
            extend: 'csv',
            title: () => {
              return `DEALROOMS ${tableTitle}`;
            }
          },

          {
            extend: 'excel',
            title: () => {
              return `DEALROOMS_${tableTitle.toLowerCase()}`;
            }
          },

          {
            extend: 'pdf',
            title: () => {
              return `DEALROOMS ${tableTitle}`;
            }
          },

          {
            extend: 'print',
            title: () => {
              return `DEALROOMS ${tableTitle}`;
            }
          }

        ],
      });

      table.buttons().container()
        .appendTo(`#${tId}_wrapper .col-md-6:eq(0)`);

    }, 1);
  });
};

export const rerender = (data, tableId = '', tableTitle = '') => {
  $(document).ready(() => {
    if ($.fn.DataTable.isDataTable(`#${tableId}`)) {
      $(`#${tableId}`).DataTable().destroy();
    }
    run(data, tableId, tableTitle);

  });
};


export const triggerModalOrOverlay = (action: string, modalId: string) => {

  (action === 'open') ? $(`#${modalId}`).modal('show') : $(`#${modalId}`).modal('hide');
  // (action === "open") ? this.overlay.open(modalId, 'slideInLeft') : this.overlay.close(modalId, () => {
  // });

};

// export const jQuery(document).ready(()=> {
//   TableData.init()
// })


