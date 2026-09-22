<?php

namespace App\Models;

use App\Traits\BelongsToTenant;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Support\Str;

class Product extends Model
{
    use HasFactory, BelongsToTenant;

    protected $keyType = 'string';
    public $incrementing = false;

    protected $fillable = [
        'id',
        'company_id',
        'sku',
        'name',
        'type',
        'category',
        'unit_of_measure',
        'unit_cost',
        'unit_price',
        'safety_stock_threshold',
    ];

    protected $casts = [
        'unit_cost' => 'decimal:2',
        'unit_price' => 'decimal:2',
        'safety_stock_threshold' => 'integer',
    ];

    protected static function boot()
    {
        parent::boot();
        static::creating(function ($model) {
            if (empty($model->{$model->getKeyName()})) {
                $model->{$model->getKeyName()} = (string) Str::uuid();
            }
        });
    }

    public function stockItems(): HasMany
    {
        return $this->hasMany(StockItem::class);
    }

    public function stockMovements(): HasMany
    {
        return $this->hasMany(StockMovement::class);
    }

    public function bom(): HasOne
    {
        return $this->hasOne(BillOfMaterial::class);
    }

    public function getTotalPhysicalStockAttribute(): int
    {
        return (int) $this->stockItems()->sum('physical_quantity');
    }

    public function getTotalAvailableStockAttribute(): int
    {
        return (int) $this->stockItems()->selectRaw('SUM(physical_quantity - reserved_quantity - blocked_quantity) as available')->value('available') ?? 0;
    }
}
