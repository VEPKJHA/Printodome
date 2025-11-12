using Microsoft.EntityFrameworkCore;
using Printodome.Domain.Entities;
using Printodome.Domain.Enums;

namespace Printodome.Infrastructure.Data.Seed;

public static class PrintodomeDataSeeder
{
    public static async Task SeedAsync(PrintodomeDbContext context)
    {
        if (await context.Products.AsNoTracking().AnyAsync())
        {
            return; // Already seeded
        }

        var products = new List<Product>
        {
            // 1. Enterprise Printers
            new(
                "HP LaserJet Enterprise M507x Monochrome Laser",
                "HP-LJE-M507X",
                "Workgroup monochrome laser printer with 45 ppm print speeds, dual 550-sheet paper trays, hardware-level HP Sure Start security, and automatic duplexing.",
                899.99m,
                35,
                ProductCategory.Printers,
                "HP",
                "https://images.unsplash.com/photo-1612815154858-60aa4c59eaa6?w=600&auto=format&fit=crop&q=80"
            ),
            new(
                "Brother HL-L8360CDW Business Color Laser",
                "BRT-HLL-8360CDW",
                "High-yield wireless enterprise color laser printer with Gigabit Ethernet, up to 33 ppm, advanced NFC card authentication, and low-cost color output.",
                449.99m,
                48,
                ProductCategory.Printers,
                "Brother",
                "https://images.unsplash.com/photo-1588702547923-7093a6c3ba33?w=600&auto=format&fit=crop&q=80"
            ),
            new(
                "Canon imageCLASS LBP226dw All-in-One Laser",
                "CAN-IC-LBP226DW",
                "Reliable compact laser printer engineered for demanding small-to-medium offices with 40 ppm speed, mobile printing support, and high-capacity cassette.",
                299.99m,
                60,
                ProductCategory.Printers,
                "Canon",
                "https://images.unsplash.com/photo-1544652478-6653e09f18a2?w=600&auto=format&fit=crop&q=80"
            ),
            new(
                "Epson EcoTank Pro ET-5850 All-in-One Supertank",
                "EPS-ET-5850",
                "Cartridge-free supertank printing system with PrecisionCore Heat-Free Technology, ultra-low cost per page, PCL/PostScript support, and 500-sheet paper capacity.",
                849.99m,
                22,
                ProductCategory.Printers,
                "Epson",
                "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=600&auto=format&fit=crop&q=80"
            ),
            new(
                "Zebra ZT411 Industrial Thermal Label & Barcode Printer",
                "ZEB-ZT-411",
                "Heavy-duty 4-inch RFID-ready direct thermal & thermal transfer industrial barcode printer with 4.3-inch color touchscreen display and rugged metal frame.",
                1299.00m,
                15,
                ProductCategory.Printers,
                "Zebra",
                "https://images.unsplash.com/photo-1616401784845-180882ba9ba8?w=600&auto=format&fit=crop&q=80"
            ),

            // 2. Toner Cartridges
            new(
                "HP 58A Black Original LaserJet Toner Cartridge",
                "HP-CF258A",
                "Genuine HP standard toner cartridge yielding up to 3,000 pages with tamper-resistant chips and JetIntelligence precision powder engineering.",
                116.99m,
                120,
                ProductCategory.TonerCartridges,
                "HP",
                "https://images.unsplash.com/photo-1563770660941-20978e870e26?w=600&auto=format&fit=crop&q=80"
            ),
            new(
                "HP 58X High Yield Black LaserJet Toner",
                "HP-CF258X",
                "High capacity monochrome toner yielding approximately 10,000 pages for high-throughput enterprise departments.",
                238.50m,
                85,
                ProductCategory.TonerCartridges,
                "HP",
                "https://images.unsplash.com/photo-1563770660941-20978e870e26?w=600&auto=format&fit=crop&q=80"
            ),
            new(
                "Brother TN-433 High Yield Cyan Toner Cartridge",
                "BRT-TN433C",
                "Genuine Brother high yield cyan toner with up to 4,000 pages of crisp graphic vibrancy and rich reproduction.",
                89.99m,
                75,
                ProductCategory.TonerCartridges,
                "Brother",
                "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&auto=format&fit=crop&q=80"
            ),
            new(
                "Brother TN-433 High Yield Magenta Toner Cartridge",
                "BRT-TN433M",
                "Genuine Brother high yield magenta toner designed to work in seamless synergy with HL-L8360CDW series.",
                89.99m,
                70,
                ProductCategory.TonerCartridges,
                "Brother",
                "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&auto=format&fit=crop&q=80"
            ),
            new(
                "Brother TN-433 High Yield Yellow Toner Cartridge",
                "BRT-TN433Y",
                "Rich yellow color consistency across complex corporate brochures and presentations with 4,000 page rating.",
                89.99m,
                68,
                ProductCategory.TonerCartridges,
                "Brother",
                "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&auto=format&fit=crop&q=80"
            ),
            new(
                "Canon 057 Standard Black Toner Cartridge",
                "CAN-057-BLK",
                "Precision-engineered monochrome toner cartridge formulated for Canon imageCLASS series yielding 3,100 pages.",
                98.00m,
                90,
                ProductCategory.TonerCartridges,
                "Canon",
                "https://images.unsplash.com/photo-1563770660941-20978e870e26?w=600&auto=format&fit=crop&q=80"
            ),

            // 3. Maintenance Kits & Accessories
            new(
                "HP LaserJet Enterprise 110V Roller Maintenance Kit",
                "HP-RM2-5679-MK",
                "Complete roller replacement kit including transfer roller, feed rollers, separation pads, and gloves for 225,000 page service intervals.",
                229.00m,
                25,
                ProductCategory.MaintenanceKits,
                "HP",
                "https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=600&auto=format&fit=crop&q=80"
            ),
            new(
                "Brother 500-Sheet Optional Paper Feeder Cassette",
                "BRT-LT-330CL",
                "Expand paper capacity on Brother workgroup printers to eliminate frequent loading during multi-copy print runs.",
                189.99m,
                30,
                ProductCategory.Accessories,
                "Brother",
                "https://images.unsplash.com/photo-1586075010923-2dd4570fb338?w=600&auto=format&fit=crop&q=80"
            ),
            new(
                "Canon Wireless Print Server & Gigabit Network Card",
                "CAN-WIFI-NIC-01",
                "Internal hardware expansion card enabling dual-band 802.11ac Wi-Fi Direct and WPA3 Enterprise encryption.",
                149.00m,
                40,
                ProductCategory.Accessories,
                "Canon",
                "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=600&auto=format&fit=crop&q=80"
            ),
            new(
                "Hammermill Premium Laser Print Paper 24lb (5 Reams)",
                "HAM-PLP-24LB-5R",
                "99.99% Jam-Free guarantee ultra-white 24lb bond paper calibrated for crisp toner adhesion and laser reproduction.",
                64.50m,
                200,
                ProductCategory.PaperAndMedia,
                "Hammermill",
                "https://images.unsplash.com/photo-1586075010923-2dd4570fb338?w=600&auto=format&fit=crop&q=80"
            )
        };

        await context.Products.AddRangeAsync(products);
        await context.SaveChangesAsync();

        // Seed initial customer
        var customer = new Customer(
            "Eleanor",
            "Vance",
            "eleanor.vance@enterprise-corp.com",
            "+1-415-555-0199",
            "100 Montgomery St, Suite 1800",
            "San Francisco",
            "CA",
            "94104"
        );
        await context.Customers.AddAsync(customer);
        await context.SaveChangesAsync();

        // Seed historical sample orders to demonstrate analytics and reporting
        var hpPrinter = products.First(p => p.SKU == "HP-LJE-M507X");
        var brotherPrinter = products.First(p => p.SKU == "BRT-HLL-8360CDW");
        var canonPrinter = products.First(p => p.SKU == "CAN-IC-LBP226DW");
        var hpToner = products.First(p => p.SKU == "HP-CF258A");
        var brotherCyan = products.First(p => p.SKU == "BRT-TN433C");

        var order1 = new Order(
            customer.Id,
            "100 Montgomery St, Suite 1800, San Francisco, CA 94104",
            "100 Montgomery St, Suite 1800, San Francisco, CA 94104",
            "STRIPE-CHG-984210");
        order1.AddItem(hpPrinter.Id, hpPrinter.Name, hpPrinter.SKU, hpPrinter.Price, 2);
        order1.AddItem(hpToner.Id, hpToner.Name, hpToner.SKU, hpToner.Price, 4);
        order1.MarkAsProcessing();
        order1.MarkAsCompleted();

        var order2 = new Order(
            customer.Id,
            "100 Montgomery St, Suite 1800, San Francisco, CA 94104",
            "100 Montgomery St, Suite 1800, San Francisco, CA 94104",
            "STRIPE-CHG-984211");
        order2.AddItem(brotherPrinter.Id, brotherPrinter.Name, brotherPrinter.SKU, brotherPrinter.Price, 3);
        order2.AddItem(brotherCyan.Id, brotherCyan.Name, brotherCyan.SKU, brotherCyan.Price, 6);
        order2.MarkAsProcessing();
        order2.MarkAsCompleted();

        var order3 = new Order(
            customer.Id,
            "100 Montgomery St, Suite 1800, San Francisco, CA 94104",
            "100 Montgomery St, Suite 1800, San Francisco, CA 94104",
            "STRIPE-CHG-984212");
        order3.AddItem(canonPrinter.Id, canonPrinter.Name, canonPrinter.SKU, canonPrinter.Price, 1);
        order3.MarkAsProcessing();

        await context.Orders.AddRangeAsync(order1, order2, order3);
        await context.SaveChangesAsync();
    }
}

