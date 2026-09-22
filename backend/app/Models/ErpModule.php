<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class ErpModule extends Model
{
    use HasFactory;

    protected $keyType = 'string';
    public $incrementing = false;
    public $timestamps = false;

    protected $fillable = [
        'id',
        'name',
        'category',
        'monthly_price',
        'required_dependencies',
    ];

    protected $casts = [
        'monthly_price' => 'decimal:2',
        'required_dependencies' => 'array',
    ];

    public function companies(): BelongsToMany
    {
        return $this->belongsToMany(Company::class, 'company_modules', 'module_id', 'company_id')
            ->withPivot('is_active', 'activated_at')
            ->withTimestamps();
    }
}
